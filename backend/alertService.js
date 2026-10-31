'use strict';
function screenRisk(windKmh=0,rain24hMm=0){const wind=Number(windKmh)||0,rain=Number(rain24hMm)||0;return {level:wind>=60||rain>=100?'HIGH':wind>=40||rain>=60?'MODERATE':'LOW',windKmh:wind,rain24hMm:rain,officialWarning:false,method:'CycloneGuard screening thresholds'};}
function cleanAlerts(alerts=[]){return Array.isArray(alerts)?alerts.map(a=>({headline:String(a.headline||a.event||'Weather alert').slice(0,300),event:String(a.event||'').slice(0,120),severity:String(a.severity||'').slice(0,60),areas:String(a.areas||'').slice(0,300),effective:a.effective||null,expires:a.expires||null})):[];}
module.exports={screenRisk,cleanAlerts};
