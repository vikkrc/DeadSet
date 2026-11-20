// Who won, from a player's own view: shared by every phone's end screen and by the server's evening ledger (F2).
// Pure: no DOM, no imports.

/** True if the viewer won, false if they lost, null for a draw, an abandoned game, a moderator or a spectator. */
export function didIWin(v, winner) {
  const me = v?.me;
  if (!me || me.moderator || winner === 'DRAW' || winner === 'ABORTED') return null;
  if (winner === 'COFFINS') return v.coffins?.winner === me.id;
  if (winner === 'CARNIVAL') return !!v.carnival?.winners?.includes(me.id);
  if (winner === 'MIDNIGHT') return !!v.midnight?.winners?.players?.includes(me.id);
  if (winner === 'SEANCE') return !!v.seance?.winners?.includes(me.id);
  if (winner === 'OMEN') return !!v.omen?.winners?.includes(me.id);
  if (winner === 'MIRROR') return !!v.mirror?.winners?.includes(me.id);
  if (winner === 'MIMIC') { const r = v.mimic?.result; return r ? (r.side === 'LIVING') !== (r.mimic === me.id) : null; }
  if (winner === 'GRAVEROBBERS') return !!v.graverobbers?.crews?.[v.graverobbers?.winner]?.includes(me.id);
  if (winner === 'JESTER') return v.jesterId === me.id;
  if (winner === 'LOVERS') return !!me.lover;
  if (winner === 'RIPPER') return me.alignment === 'RIPPER';
  if (winner === 'CULT') return me.alignment === 'CULT';
  if (winner === 'DEMON') return me.alignment === 'DEATH';
  return (winner === 'DEATH' && me.alignment === 'DEATH') || (winner === 'NON_DEATH' && me.alignment === 'NON_DEATH');
}
