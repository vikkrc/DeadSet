import { chromium } from 'playwright';
const BASE='http://localhost:3123', O='./shots2';
let ip=200; const uid=()=>Math.random().toString(36).slice(2);
const api=async(p,b,i)=>(await fetch(BASE+p,{method:b?'POST':'GET',headers:{'content-type':'application/json','x-forwarded-for':i},body:b?JSON.stringify(b):undefined})).json();
const b=await chromium.launch();
async function ctx(w,h,lang,sess){const c=await b.newContext({viewport:{width:w,height:h}});await c.addInitScript(([s,l])=>{if(l)localStorage.setItem('deadset:lang',l);if(s)localStorage.setItem(s[0],s[1]);},[sess,lang]);return c;}
// home & guide
for (const [lang] of [['en'],['de'],['hu']]) {
  const c=await ctx(390,844,lang); const p=await c.newPage(); await p.goto(BASE+'/'); await p.waitForTimeout(2500); await p.screenshot({path:`${O}/home-phone-${lang}.png`,fullPage:true});
  if(lang==='en'){ await p.goto(BASE+'/guide'); await p.waitForTimeout(1500); await p.screenshot({path:`${O}/guide-phone.png`}); await p.screenshot({path:`${O}/guide-phone-full.png`,fullPage:true}); }
  await c.close();
}
{ const c=await ctx(1440,900,'en'); const p=await c.newPage(); await p.goto(BASE+'/'); await p.waitForTimeout(2500); await p.screenshot({path:`${O}/home-desktop.png`}); await p.goto(BASE+'/guide'); await p.waitForTimeout(1500); await p.screenshot({path:`${O}/guide-desktop.png`}); await c.close(); }
// lobby per mode
const modes=[['standard',{preset:'standard'}],['missions',{mode:'missions'}],['exorcism',{mode:'exorcism'}],['coffins',{mode:'coffins'}],['carnival',{mode:'carnival'}],['midnight',{mode:'midnight'}],['seance',{mode:'seance'}],['graverobbers',{mode:'graverobbers'}],['mimic',{mode:'mimic'}],['omen',{mode:'omen'}],['mirror',{mode:'mirror'}]];
for (const [lang,list] of [['en',modes],['de',modes.slice(0,3)],['hu',modes.slice(2,4)]]) for (const [name,set] of list) {
  const i=`10.1.${ip++}.1`; const r=await api('/api/rooms',{name:'Viktor',lang},i); const cmd=(type,payload={})=>api(`/api/rooms/${r.code}/cmd`,{t:r.token,type,payload,key:uid()},i);
  await cmd('host.settings',set); await cmd('host.bots',{count:5});
  const c=await ctx(390,844,lang,[`deadset:${r.code}`,JSON.stringify(r)]); const p=await c.newPage(); await p.goto(`${BASE}/r/${r.code}`); await p.waitForTimeout(2200);
  await p.screenshot({path:`${O}/lobby-${name}-${lang}-phone.png`,fullPage:true});
  if(lang==='en'){ const t=await (await b.newContext({viewport:{width:1600,height:900}})).newPage(); await t.goto(`${BASE}/board/${r.code}`); await t.waitForTimeout(2200); await t.screenshot({path:`${O}/lobby-${name}-tv.png`}); await t.context().close();
    if(name==='standard'||name==='coffins'){ await p.click('[data-act=sheet][data-id=record]').catch(()=>{}); await p.waitForTimeout(900); await p.screenshot({path:`${O}/menu-${name}-phone.png`,fullPage:true}); }
  }
  if(name==='standard'&&lang==='en'){ const c2=await ctx(390,844,'en'); const q=await c2.newPage(); await q.goto(`${BASE}/r/${r.code}`); await q.waitForTimeout(2200); await q.screenshot({path:`${O}/invite-phone.png`,fullPage:true}); await c2.close(); }
  await c.close();
}
await b.close();
