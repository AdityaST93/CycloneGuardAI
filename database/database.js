'use strict';
const fs=require('node:fs/promises'),path=require('node:path');const {validate}=require('./schemas');const root=path.resolve(__dirname,'..','data');const files={weather:'weather_data.json',disaster:'disaster_records.json'};
async function read(type){if(!files[type])throw new Error('Unknown collection.');const data=JSON.parse(await fs.readFile(path.join(root,files[type]),'utf8'));return data.records||[];}
async function append(type,row){const result=validate(type,row);if(!result.valid)throw new Error(`Invalid record; missing: ${result.missing.join(', ')}`);const filename=path.join(root,files[type]),data=JSON.parse(await fs.readFile(filename,'utf8'));data.records.push(row);const temp=`${filename}.tmp`;await fs.writeFile(temp,JSON.stringify(data,null,2)+'\n',{flag:'w'});await fs.rename(temp,filename);return row;}
module.exports={read,append};
