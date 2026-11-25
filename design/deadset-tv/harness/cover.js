const fs=require('fs');const {chromium}=require('playwright');const D='/home/claude/harness/tv';
(async()=>{const b=await chromium.launch();const files=process.argv.slice(2).length?process.argv.slice(2):fs.readdirSync(D).filter(f=>f.endsWith('.html'));
for(const f of files){const pg=await b.newPage({viewport:{width:1600,height:1400}});await pg.goto('file://'+D+'/'+f);await pg.evaluate(()=>document.fonts.ready);
await pg.addStyleTag({content:'.tvwrap>.ann{display:none!important}'});
const r=await pg.evaluate(()=>{const out=[];const tv=document.querySelector('.tvx');if(!tv)return out;
const T=[...tv.querySelectorAll('*')].filter(e=>!e.closest('svg')&&[...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim()));
const nm=e=>e.tagName.toLowerCase()+(typeof e.className=='string'&&e.className.trim()?'.'+e.className.trim().split(/\s+/).join('.'):'');
for(const e of T){const cs=getComputedStyle(e);if(cs.visibility=='hidden'||+cs.opacity<.05)continue;const rg=document.createRange();rg.selectNodeContents(e);
for(const x of [...rg.getClientRects()].filter(x=>x.width>2&&x.height>2)){let bad=0,hit=null;const pts=[[.5,.5],[.15,.5],[.85,.5]];for(const [px,py] of pts){const h=document.elementFromPoint(x.left+x.width*px,x.top+x.height*py);if(!h)continue;if(h===e||e.contains(h)||h.contains(e))continue;bad++;hit=h}
if(bad>=1)out.push(`"${e.textContent.trim().slice(0,28)}"(${nm(e)}) under ${nm(hit)} [${bad}/3] @${x.left|0},${x.top|0}`)}}
return [...new Set(out)]});
console.log('==',f,r.length);r.slice(0,30).forEach(x=>console.log('  ',x));await pg.close()}await b.close()})();
