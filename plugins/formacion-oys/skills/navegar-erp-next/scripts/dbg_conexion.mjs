import puppeteer from 'puppeteer-core';
const ID=process.env.TABID;
setTimeout(()=>{console.log('T');process.exit(1)},40000);
const b=await puppeteer.connect({browserURL:'http://127.0.0.1:9333',defaultViewport:null,targetFilter:t=>t.type()==='browser'||t._getTargetInfo().targetId===ID});
console.log('conn');
const t=await b.waitForTarget(t=>t.type()==='page',{timeout:15000});console.log('target',t.url());
const p=await t.page();console.log('page');
console.log(await p.title());
const cs=await p.target().createCDPSession();console.log('cdp');
await cs.send('Emulation.setFocusEmulationEnabled',{enabled:true});console.log('focus');
console.log(await p.evaluate(()=>[innerWidth,innerHeight,devicePixelRatio]));
await p.setViewport({width:1920,height:1080,deviceScaleFactor:2});console.log('vp');
process.exit(0)
