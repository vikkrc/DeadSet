// reports any visible element in the TV body that comes within 16 px of the frame's bottom edge (900-84) or the stage sides
const fs=require('fs');const {chromium}=require('playwright');const D='/home/claude/harness/tv/';
(async()=>{const b=await chromium.launch();for(const f of fs.readdirSync(D).filter(f=>f.endsWith('.html'))){const p=await b.newPage({viewport:{width:1600,height:2600}});await p.goto('file://'+D+f);await p.evaluate(()=>document.fonts.ready);
const r=await p.evaluate(()=>{const out=[];for(const tv of document.querySelectorAll('.tvwrap>.tvx')){const T=tv.getBoundingClientRect();const lim=T.top+900-84-14;const body=tv.querySelector('.tb');if(!body)continue;
for(const e of body.querySelectorAll('*')){const cs=getComputedStyle(e);if(cs.visibility=='hidden'||cs.display=='none')continue;const r=e.getBoundingClientRect();if(r.width<2||r.height<2)continue;if(r.bottom>lim){out.push((e.className||e.tagName).toString().slice(0,40)+' bottom '+Math.round(r.bottom-T.top))}}}
return [...new Set(out)].slice(0,6)});if(r.length)console.log(f,r);await p.close()}await b.close()})();
