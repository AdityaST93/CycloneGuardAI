'use strict';

function validateQuery(value) {
  const q = String(value || '').trim();
  return q && q.length <= 100 && !/[\u0000-\u001f\u007f]/.test(q) ? q : null;
}
function jsonResponse(url, timeout = 12000) { return fetch(url, { signal: AbortSignal.timeout(timeout), headers: { Accept: 'application/json' } }).then(async response => { const data = await response.json().catch(() => ({})); if (!response.ok) throw Object.assign(new Error('Weather provider request failed.'), { status: response.status, data }); return data; }); }
async function weatherApi(endpoint, params) {
  const key = process.env.WEATHER_API_KEY;
  if (!key) throw Object.assign(new Error('WeatherAPI is not configured.'), { status: 503, code: 'not_configured' });
  const url = new URL(`https://api.weatherapi.com/v1/${endpoint}`); url.search = new URLSearchParams({ ...params, key });
  const data = await jsonResponse(url);
  if (data.error) throw Object.assign(new Error(data.error.code === 1006 ? 'Location was not found.' : 'WeatherAPI request failed. Check key and plan.'), { status: data.error.code === 1006 ? 404 : 502, code: data.error.code });
  return data;
}
function normalizeWeatherApi(data, requestedDays) {
  const loc = data.location || {}, c = data.current || {}, days = data.forecast?.forecastday || [];
  const currentTime = new Date(Number(c.last_updated_epoch || Date.now() / 1000) * 1000).toISOString();
  const rawHours = days.flatMap(d => d.hour || []).filter(h => Number(h.time_epoch) > Number(c.last_updated_epoch || 0)).sort((a,b) => a.time_epoch - b.time_epoch);
  const hourlyRows = [{ time_epoch: c.last_updated_epoch, temp_c: c.temp_c, feelslike_c: c.feelslike_c, humidity: c.humidity, precip_mm: c.precip_mm, chance_of_rain: null, wind_kph: c.wind_kph, gust_kph: c.gust_kph, wind_degree: c.wind_degree, pressure_mb: c.pressure_mb, vis_km: c.vis_km, cloud: c.cloud }, ...rawHours];
  const values = (field, convert = Number) => hourlyRows.map(h => h[field] == null ? null : convert(h[field]));
  const current = { time: currentTime, temperature_2m: c.temp_c, apparent_temperature: c.feelslike_c, relative_humidity_2m: c.humidity, wind_speed_10m: c.wind_kph, wind_gusts_10m: c.gust_kph, wind_direction_10m: c.wind_degree, surface_pressure: c.pressure_mb, precipitation: c.precip_mm, visibility: Number.isFinite(Number(c.vis_km)) ? Number(c.vis_km)*1000 : null, cloud_cover: c.cloud, uv_index: c.uv, weather_code: c.condition?.code, condition_text: c.condition?.text || 'Current conditions', is_day: c.is_day };
  const hourly = { time: hourlyRows.map(h => new Date(Number(h.time_epoch)*1000).toISOString()), temperature_2m: values('temp_c'), apparent_temperature: values('feelslike_c'), relative_humidity_2m: values('humidity'), precipitation: values('precip_mm'), precipitation_probability: values('chance_of_rain'), wind_speed_10m: values('wind_kph'), wind_gusts_10m: values('gust_kph'), wind_direction_10m: values('wind_degree'), pressure_msl: values('pressure_mb'), visibility: values('vis_km',v=>Number(v)*1000), cloud_cover: values('cloud') };
  const daily = { time: days.map(d=>d.date), temperature_2m_max: days.map(d=>d.day?.maxtemp_c), temperature_2m_min: days.map(d=>d.day?.mintemp_c), precipitation_sum: days.map(d=>d.day?.totalprecip_mm), precipitation_probability_max: days.map(d=>d.day?.daily_chance_of_rain), uv_index_max: days.map(d=>d.day?.uv) };
  const alertList = data.alerts?.alert || [];
  return { provider:'WeatherAPI.com', location:{name:loc.name||'',admin1:loc.region||'',country:loc.country||'',latitude:loc.lat,longitude:loc.lon}, timezone:loc.tz_id||'', current, hourly, daily, alerts:alertList.map(a=>({headline:a.headline||a.event||'Weather alert',event:a.event||'',severity:a.severity||'',areas:a.areas||'',effective:a.effective||null,expires:a.expires||null})), alertsAvailable:Boolean(data.alerts), airQuality:c.air_quality?{us_aqi:c.air_quality['us-epa-index']??null,pm2_5:c.air_quality.pm2_5??null,pm10:c.air_quality.pm10??null}:null, availableDays:days.length, requestedDays, fetchedAt:new Date().toISOString() };
}
async function openMeteoForecast(query, days=7) {
  let lat, lon, name='Selected location', admin1='', country='';
  const pair=String(query).split(',').map(Number);
  if(pair.length===2 && pair.every(Number.isFinite)){[lat,lon]=pair;}
  else {const geo=new URL('https://geocoding-api.open-meteo.com/v1/search');geo.search=new URLSearchParams({name:query,count:'1',language:'en',format:'json'});const found=await jsonResponse(geo);if(!found.results?.length)throw Object.assign(new Error('Location was not found.'),{status:404});({latitude:lat,longitude:lon,name,admin1='',country=''}=found.results[0]);}
  const url=new URL('https://api.open-meteo.com/v1/forecast');
  url.search=new URLSearchParams({latitude:lat,longitude:lon,current:'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',hourly:'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,precipitation_probability,wind_speed_10m,wind_gusts_10m,wind_direction_10m,surface_pressure',daily:'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max',forecast_days:String(Math.max(1,Math.min(10,days))),past_days:'1',timezone:'auto',wind_speed_unit:'kmh'});
  const data=await jsonResponse(url);if(!data.current||!data.hourly)throw new Error('Open-Meteo returned incomplete forecast data.');
  try{const aq=new URL('https://air-quality-api.open-meteo.com/v1/air-quality');aq.search=new URLSearchParams({latitude:lat,longitude:lon,current:'us_aqi,european_aqi,pm2_5,pm10',timezone:'auto'});const air=await jsonResponse(aq,10000);data.airQuality=air.current||null;}catch{data.airQuality=null;}
  const offset=Number(data.utc_offset_seconds||0)*1000, convert=t=>new Date(Date.parse(`${t.replace(' ','T')}Z`)-offset).toISOString();
  data.current.time=convert(data.current.time);data.hourly.time=data.hourly.time.map(convert);
  return {...data,provider:'Open-Meteo',location:{name,admin1,country,latitude:lat,longitude:lon},timezone:data.timezone,alerts:[],alertsAvailable:false,availableDays:data.daily?.time?.length||0,requestedDays:days,fetchedAt:new Date().toISOString()};
}
async function getForecast(query, days=7) {
  const q=validateQuery(query);if(!q)throw Object.assign(new Error('Enter a valid city or coordinates.'),{status:400});
  if(process.env.WEATHER_API_KEY){try{return normalizeWeatherApi(await weatherApi('forecast.json',{q,days:String(Math.max(1,Math.min(10,days))),aqi:'yes',alerts:'yes'}),days);}catch(e){if(e.code!==2009)throw e;}}
  return openMeteoForecast(q,days);
}
async function searchLocations(query) {
  const q=validateQuery(query);if(!q)throw Object.assign(new Error('Enter a location.'),{status:400});
  if(process.env.WEATHER_API_KEY){try{const rows=await weatherApi('search.json',{q});return rows.slice(0,8).map(x=>({name:x.name,admin1:x.region||'',country:x.country||'',latitude:x.lat,longitude:x.lon}));}catch(e){if(e.status!==404)throw e;}}
  const url=new URL('https://geocoding-api.open-meteo.com/v1/search');url.search=new URLSearchParams({name:q,count:'8',language:'en',format:'json'});const data=await jsonResponse(url);
  return (data.results||[]).map(x=>({name:x.name,admin1:x.admin1||x.admin2||'',country:x.country||'',latitude:x.latitude,longitude:x.longitude}));
}
module.exports={validateQuery,weatherApi,normalizeWeatherApi,openMeteoForecast,getForecast,searchLocations};
