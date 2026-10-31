'use strict';
function satelliteSources(){const date=new Date(Date.now()-2*86400000).toISOString().slice(0,10);return {imageryDate:date,sources:[{name:'NASA GIBS VIIRS corrected reflectance',type:'satellite imagery',observedRadar:false}],note:'Satellite imagery is a basemap; this project does not claim that it is live radar.'};}
module.exports={satelliteSources};
