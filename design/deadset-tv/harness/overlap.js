const fs=require('fs');const {chromium}=require('playwright');
const D='/home/claude/harness/tv';
(async()=>{const b=await chromium.launch();const files=process.argv.slice(2).length?process.argv.slice(2):fs.readdirSync(D).filter(f=>f.endsWith('.html'));
for(const f of files){const pg=await b.newPage({viewport:{width:1600,height:1400}});await pg.goto('file://'+D+'/'+f);await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(200);
const r=await pg.evaluate(()=>{const out=[];const tv=document.querySelector('.tvx');if(!tv)return out;
const T=[...tv.querySelectorAll('*')].filter(e=>{if(e.closest('svg'))return false;const cs=getComputedStyle(e);if(cs.visibility=='hidden'||cs.display=='none'||+cs.opacity==0)return false;return [...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim())});
const box=e=>{const rg=document.createRange();rg.selectNodeContents(e);const rs=[...rg.getClientRects()].filter(x=>x.width>1);if(!rs.length)return null;let l=1e9,t=1e9,r=-1e9,bm=-1e9;for(const x of rs){l=Math.min(l,x.left);t=Math.min(t,x.top);r=Math.max(r,x.right);bm=Math.max(bm,x.bottom)}return {l,t,r,b:bm}};
const items=T.map(e=>({e,b:box(e),txt:e.textContent.trim().slice(0,30)})).filter(x=>x.b);
const name=e=>(e.className&&typeof e.className=='string'?'.'+e.className.trim().split(/\s+/).join('.'):e.tagName.toLowerCase());
for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){const a=items[i],c=items[j];if(a.e.contains(c.e)||c.e.contains(a.e))continue;
const ox=Math.min(a.b.r,c.b.r)-Math.max(a.b.l,c.b.l),oy=Math.min(a.b.b,c.b.b)-Math.max(a.b.t,c.b.t);if(ox>3&&oy>3)out.push(`TXT  "${a.txt}"(${name(a.e)}) x "${c.txt}"(${name(c.e)}) ${ox|0}x${oy|0} @${a.b.l|0},${a.b.t|0}`)}
// clipping by overflow-hidden ancestors / tv bounds
const tb=tv.getBoundingClientRect();
for(const it of items){let p=it.e.parentElement;while(p&&p!==tv.parentElement){const cs=getComputedStyle(p);if(cs.overflow!='visible'||p===tv){const pr=p.getBoundingClientRect();if(it.b.r>pr.right+2||it.b.b>pr.bottom+2||it.b.l<pr.left-2||it.b.t<pr.top-2){out.push(`CLIP "${it.txt}"(${name(it.e)}) by ${name(p)}`);break}}p=p.parentElement}}
// pins over text
const pins=[...document.querySelectorAll('.tvwrap>.ann')];for(const pn of pins){const pb=pn.getBoundingClientRect();for(const it of items){const ox=Math.min(pb.right,it.b.r)-Math.max(pb.left,it.b.l),oy=Math.min(pb.bottom,it.b.b)-Math.max(pb.top,it.b.t);if(ox>4&&oy>4)out.push(`PIN ${pn.textContent} over "${it.txt}"`)}}
return out});
console.log('==',f,r.length);r.slice(0,40).forEach(x=>console.log('  ',x));await pg.close()}
await b.close()})();
