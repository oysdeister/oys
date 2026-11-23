import puppeteer from 'puppeteer-core';
import fs from 'fs';
import zlib from 'zlib';
// uso: node harvest.mjs <codes.txt> [conc=4]
const [lista, concS='4'] = process.argv.slice(2);
const CONC = +concS;
// Carpeta de salida: CAP_DIR (por defecto ~/.cache/oys-demo-cap/cat). Debe contener index_prev.json (cópialo de una captura anterior o créalo con {}).
const OUT = process.env.CAP_DIR || (process.env.HOME + '/.cache/oys-demo-cap/cat');
for (const d of ['raw','btn','sub']) fs.mkdirSync(`${OUT}/${d}`, {recursive:true});
const codes = fs.readFileSync(lista,'utf8').split('\n').map(s=>s.trim()).filter(Boolean);
const prev = JSON.parse(fs.readFileSync(`${OUT}/index_prev.json`,'utf8'));
const b = await puppeteer.connect({browserURL:'http://127.0.0.1:9333', defaultViewport:null});
const p = await b.newPage();
await p.goto('https://nextdemo.geasa.eu/view/app/tutorial/home/', {waitUntil:'domcontentloaded'}).catch(e=>console.log('goto',e.message));
await new Promise(r=>setTimeout(r,5000));
const sleep = ms=>new Promise(r=>setTimeout(r,ms));
async function api(ruta, metodo='GET', body){
  for (let i=0;i<60;i++){
    let r;
    try {
      r = await p.evaluate(async (ruta, metodo, body) => {
        const c = window.__CSRF__; const csrf = (c && (c.token || c)) || '';
        const ac = new AbortController(); const to = setTimeout(()=>ac.abort(), 90000);
        try {
          const res = await fetch('/view/app/tutorial/' + ruta, { method: metodo, signal: ac.signal, headers: { 'X-CSRF-TOKEN': csrf, 'r-uuid': crypto.randomUUID(), 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json', 'Content-Type': 'application/json' }, body: body || undefined, redirect: 'manual' });
          return { status: res.status, text: await res.text() };
        } catch(e){ return {status:-1, text:String(e)}; } finally { clearTimeout(to); }
      }, ruta, metodo, body);
    } catch(e){ r={status:-2,text:String(e)}; }
    if (r.status===0 || r.status===302 || r.status===303){ console.log('SESION?', r.status, ruta); fs.writeFileSync(OUT+'/SESION_CADUCADA', ruta); process.exit(5); }
    if (r.status===503 || r.status<0 || r.status===429){ await sleep(3000+i*1000); continue; }
    if ((r.status===201 || r.status===202) || /^\{"status":"(RUNNING|PENDING|QUEUED)"/.test(r.text)){ await sleep(1500); continue; }
    if (r.status===404 && /Task .* not found/.test(r.text)){ await sleep(1000); continue; }
    if (r.status===500 && /maximum allowed concurrent/.test(r.text)){ await sleep(4000+Math.random()*4000); continue; }
    return r;
  }
  return {status:-9, text:''};
}
const gz = (f, t)=>fs.writeFileSync(f, zlib.gzipSync(t));
const b64 = code => Buffer.from(JSON.stringify({db:'tutorial',code,user_input:{cols:{},vars:{},groups:[],link:null,orderBy:{},sqlFilter:null},exportOptions:null})).toString('base64');
let hechos=0;
async function uno(code){
  const done = `${OUT}/raw/${code}.done`;
  if (fs.existsSync(done)) return;
  const B = b64(code); const est={code};
  const L = await api(`table/${code}/list/${B}/1`);
  est.list=L.status; if (L.status===200) gz(`${OUT}/raw/${code}.list.json.gz`, L.text);
  let total=0; try{ total = JSON.parse(L.text).resultSet.pagination.totalTableRows||0 }catch(e){}
  est.total=total;
  const R0 = await api(`table/${code}/list/${B}/dml/insert/reset/form`);
  est.reset=R0.status; if (R0.status===200) gz(`${OUT}/raw/${code}.reset.json.gz`, R0.text);
  if (total>0){
    const R = await api(`table/${code}/form/1/${B}/row`);
    est.row=R.status;
    if (R.status===200){
      gz(`${OUT}/raw/${code}.row.json.gz`, R.text);
      let d; try{ d=JSON.parse(R.text) }catch(e){}
      const bots = d?.cursor?.actions?.button?.rows || [];
      est.bf=0;
      for (const bt of bots){
        if (!bt?.form?.hasFields) continue;
        const F = await api(`table/${code}/form/1/${B}/action/${encodeURIComponent(bt.code)}/fields/1`, 'POST', '{"form":{}}');
        if (F.status===200){ gz(`${OUT}/btn/${code}.${bt.code}.json.gz`, F.text); est.bf++; }
      }
      // subrejillas sin objeto propio en el catálogo
      est.sub=0;
      for (const Lay of d?.form?.layouts||[]) for (const bx of Lay.boxes||[]) for (const t of bx.tabs||[]){
        const sc=t?.component?.code;
        if (t.type!=='OBJECT' || !sc || prev[sc] || fs.existsSync(`${OUT}/sub/${sc}.json.gz`)) continue;
        const S = await api(`table/${code}/form/1/${B}/cursor/${t.tabid}/1/list?rows=20`);
        if (S.status===200){ gz(`${OUT}/sub/${sc}.json.gz`, S.text); est.sub++; }
      }
      await api(`table/${code}/form/1/${B}/delete`, 'DELETE');
    }
  }
  fs.writeFileSync(done, JSON.stringify(est));
  hechos++; if (hechos%20===0) console.log(new Date().toISOString(), 'hechos', hechos, '/', codes.length, JSON.stringify(est));
}
let k=0;
async function worker(){ while(k<codes.length){ const c=codes[k++]; try{ await uno(c) }catch(e){ console.log('ERR',c,e.message) } } }
await Promise.all(Array.from({length:CONC},worker));
console.log('FIN', hechos);
await p.close(); process.exit(0);
