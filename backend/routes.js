'use strict';
function createRouter({json,limit,handlers}){return async function route(req,url,res){const key=`${req.method} ${url.pathname}`;if(key==='GET /api/status'){json(res,200,handlers.status());return true;}if(['/api/weather/forecast','/api/weather/search','/api/cyclones'].includes(url.pathname)&&!limit(req)){json(res,429,{error:'Request limit reached. Wait a minute and try again.'});return true;}const handler=handlers.routes[key];if(!handler)return false;await handler(req,url,res);return true;};}
module.exports={createRouter};
