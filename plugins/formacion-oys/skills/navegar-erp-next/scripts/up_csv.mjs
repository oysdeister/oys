import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const b=await puppeteer.connect({browserURL:'http://127.0.0.1:9333',defaultViewport:null});
const reg=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
let page;for(const t of b.targets()){if(t._targetId===reg.pedido2){page=await t.page();}}
const inp=await page.$('input[type=file]');
await inp.uploadFile(process.argv[2]);
console.log('ok');b.disconnect();
