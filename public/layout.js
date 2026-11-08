// Seat positions around the table, shared by phones and the TV board.
// Up to 14 players sit on one ring. Larger tables (15–25) use two staggered
// rings in a zigzag: seat 0 outer, seat 1 inner, seat 2 outer… so seat order
// still reads clockwise and neighbours stay side by side.
export function seatLayout(n) {
  if (n <= 14) {
    const R = n <= 6 ? 36 : 38.5;
    const tok = n <= 6 ? 60 : n <= 8 ? 54 : n <= 10 ? 48 : n <= 13 ? 42 : 38;
    const pos = Array.from({ length: n }, (_, i) => polar(-90 + (i * 360) / n, R));
    return { pos, tok, dense: false };
  }
  const outer = Math.ceil(n / 2);
  const step = 360 / outer;
  const pos = Array.from({ length: n }, (_, i) => {
    const inner = i % 2 === 1;
    return polar(-90 + Math.floor(i / 2) * step + (inner ? step / 2 : 0), inner ? 28.5 : 42.5, inner);
  });
  const tok = n <= 18 ? 36 : n <= 22 ? 34 : 32;
  return { pos, tok, dense: true };
}

function polar(deg, R, inner = false) {
  const a = (deg * Math.PI) / 180;
  return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a), inner };
}
