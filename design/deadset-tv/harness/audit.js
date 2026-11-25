window.__dsAudit = async function (kind) {
  const W = innerWidth, H = innerHeight, out = { kind, small: [], taps: [], overflow: [], sizes: {}, contrast: [] };
  const vis = (el) => { const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const label = (el) => (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : el.tagName.toLowerCase());
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = walker.nextNode())) {
    const tx = n.textContent.trim(); if (!tx) continue; const el = n.parentElement; if (!el || !vis(el)) continue;
    if (el.closest('svg')) continue;
    const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > H * 1.2) continue;
    let fs = parseFloat(getComputedStyle(el).fontSize);
    let sc = 1; let p = el; while (p && p !== document.body) { const t = getComputedStyle(p).transform; if (t && t !== 'none') { const m = t.match(/matrix\(([^,]+),([^,]+)/); if (m) sc *= Math.hypot(+m[1], +m[2]); } p = p.parentElement; }
    fs = Math.round(fs * sc * 10) / 10;
    const b = Math.floor(fs); out.sizes[b] = (out.sizes[b] || 0) + tx.length;
    const lim = kind === 'tv' ? 16 : 11;
    if (fs < lim) out.small.push([fs, label(el), tx.slice(0, 40)]);
  }
  if (kind === 'phone') for (const el of document.querySelectorAll('button,[data-act],[data-hold],a[href],input,select,[role=button]')) {
    if (!vis(el)) continue; const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > H) continue;
    if (el.disabled) continue;
    if (r.width < 44 || r.height < 44) out.taps.push([Math.round(r.width), Math.round(r.height), label(el), (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)]);
  }
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el) || el.closest('svg') && el.tagName !== 'svg') continue; const r = el.getBoundingClientRect();
    if (r.right > W + 2 || r.left < -2) {
      let clipped = false, p = el.parentElement; while (p && p !== document.body) { const cs = getComputedStyle(p); if (/(hidden|auto|scroll|clip)/.test(cs.overflowX) && p.getBoundingClientRect().right <= W + 2) { clipped = true; break; } p = p.parentElement; }
      if (!clipped && getComputedStyle(el).position !== 'fixed') out.overflow.push([label(el), Math.round(r.left), Math.round(r.right)]);
    }
  }
  if (kind === 'tv') { for (const el of document.querySelectorAll('body *')) { if (!vis(el)) continue; const r = el.getBoundingClientRect(); if (r.bottom > H + 2 && r.top < H && r.height < H && !el.closest('[style*=overflow]')) { let cl=false,p=el.parentElement; while(p&&p!==document.body){const cs=getComputedStyle(p); if(/(hidden|auto|scroll|clip)/.test(cs.overflowY)&&p.getBoundingClientRect().bottom<=H+2){cl=true;break;} p=p.parentElement;} if(!cl) out.overflow.push(['Y:' + label(el), Math.round(r.top), Math.round(r.bottom)]); } } }
  try { const res = await axe.run(document.body, { runOnly: ['color-contrast'], resultTypes: ['violations'] }); for (const v of res.violations) for (const nd of v.nodes) out.contrast.push([nd.target.join(' ').slice(-60), (nd.any[0]?.data?.contrastRatio) || null, (nd.any[0]?.data?.fontSize) || '', (nd.any[0]?.data?.fgColor||'')+'/'+(nd.any[0]?.data?.bgColor||'')]); } catch (e) { out.contrast.push(['axe error', String(e)]); }
  return out;
};
