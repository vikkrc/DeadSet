// Seat positions around the table, shared by phones and the TV board.
// Up to 12 players sit on one ring. Larger tables (13–25) use two staggered
// rings in a zigzag: seat 0 outer, seat 1 inner, seat 2 outer… so seat order
// still reads clockwise and neighbours stay side by side.
export function seatLayout(n) {
  // Y-scale: one table in five steps (UX-PASS §38). Medallion sizes are the phone's; the TV sets its own.
  if (n <= 12) {
    const step = n <= 5 ? 'intimate' : n <= 8 ? 'roomy' : 'snug';
    const R = n <= 5 ? 36 : 40;
    const tok = n <= 8 ? 54 : 44;
    const pos = Array.from({ length: n }, (_, i) => polar(-90 + (i * 360) / n, R));
    return { pos, tok, dense: false, step };
  }
  const crowded = n >= 19;
  const outer = Math.ceil(n / 2);
  const st = 360 / outer;
  const pos = Array.from({ length: n }, (_, i) => {
    const inner = i % 2 === 1;
    return polar(-90 + Math.floor(i / 2) * st + (inner ? st / 2 : 0), inner ? (crowded ? 31 : 29) : (crowded ? 43 : 42), inner);
  });
  return { pos, tok: crowded ? 30 : 36, dense: true, step: crowded ? 'crowded' : 'two' };
}

function polar(deg, R, inner = false) {
  const a = (deg * Math.PI) / 180;
  return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a), inner };
}

/**
 * M2: the turn bead. One gilt bead that travels along the table's arc to the seat whose turn it is (Pass,
 * --t-pass), the same in every turn-based mode, phone and TV. `p` is the seat's position from seatLayout;
 * `inner` lets the mode's own object (lantern, Candle) ride on it. The bead always travels forward, clockwise,
 * the way turns pass, so it is unwrapped against the last angle it showed.
 */
let beadLast = null;
export function turnBead(p, inner = '') {
  if (!p) return '';
  const deg = (Math.atan2(p.y - 50, p.x - 50) * 180) / Math.PI + 90; // 0 at the top, clockwise
  let a = deg;
  if (beadLast !== null) a = beadLast + ((((deg - beadLast) % 360) + 360) % 360);
  beadLast = a;
  const r = Math.hypot(p.x - 50, p.y - 50);
  return `<div class="bead-arm" data-key="bead" style="--a:${a.toFixed(1)}deg;--r:${r.toFixed(2)}%" aria-hidden="true"><i class="bead">${inner}</i></div>`;
}
