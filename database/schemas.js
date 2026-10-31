'use strict';
const REQUIRED={weather:['observedAt','provider','location','latitude','longitude'],disaster:['id','eventType','source','observedAt']};
function validate(type,row){const required=REQUIRED[type];if(!required||!row||typeof row!=='object')return {valid:false,missing:[]};const missing=required.filter(k=>row[k]===undefined||row[k]===null||row[k]==='');return {valid:missing.length===0,missing};}
module.exports={REQUIRED,validate};
