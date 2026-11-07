// Deterministic night adjudication (§11, §15, §23).
// All inputs were collected while NIGHT_ACTIONS was open; this function stages
// every consequence in local sets and commits them atomically at the end.
import { ROLES, DREAMS, PRODUCTS } from './content.js';
import { byId, nameOf, hasRule, priv, pub } from './state.js';
import { pick } from './rng.js';

const roleName = (id) => ROLES[id]?.name ?? id;

export function resolveNight(m, rng) {
  const N = m.night;
  const n = N.number;
  const aliveAtOpen = new Set(N.aliveAtOpen);
  const dreamOf = (id) => N.dreams[id];
  const seat = (id) => byId(m, id).seat;
  const insomnia = []; // chronological public-to-holder narrative
  const reports = {}; // pid -> [{text, kind}] delivered only to survivors
  const say = (pid, text, kind = 'report') => (reports[pid] ||= []).push({ text, kind });
  const ins = (text) => insomnia.push(text);
  const unreliable = hasRule(m, 'UNRELIABLE_POWER');
  const roll = () => rng.int(6, 'd6') + 1; // 1..6

  // ── R1: freeze valid intents ────────────────────────────────────────────
  // Each intent = one use of a role action.
  const intents = [];
  const actors = Object.keys(N.actions)
    .filter((pid) => aliveAtOpen.has(pid) && N.schemas[pid] && !N.schemas[pid].blocked)
    .sort((a, b) => seat(a) - seat(b));
  for (const pid of actors) {
    const schema = N.schemas[pid];
    const uses = N.actions[pid].uses || [];
    const p = byId(m, pid);
    uses.slice(0, schema.uses).forEach((u, idx) => {
      intents.push({ actorId: pid, roleId: schema.roleId, kind: schema.kind, idx, target: u.target ?? null, option: u.option ?? null, ok: true, why: null });
    });
    // Charge consumption on a valid submitted attempt (§15).
    const def = ROLES[schema.roleId]?.night;
    if (def?.charges && uses.length) p.charges[schema.roleId] = Math.max(0, (p.charges[schema.roleId] ?? 0) - 1);
  }
  const fail = (it, why) => { if (it.ok) { it.ok = false; it.why = why; } };

  // Death command: identical confirmed sets from every member, else pass.
  const team = N.death?.members ?? [];
  let deathCmd = null;
  let deathWhy = null;
  if (team.length) {
    const sets = team.map((id) => N.death.confirmed[id]);
    const allConfirmed = sets.every((s) => Array.isArray(s));
    const key = (s) => [...s].sort().join(',');
    if (allConfirmed && sets.every((s) => key(s) === key(sets[0])) && sets[0].length > 0) {
      deathCmd = { targets: [...sets[0]].sort((a, b) => seat(a) - seat(b)).slice(0, N.death.capacity), ok: true };
    } else {
      deathWhy = allConfirmed && sets.every((s) => s.length === 0) ? 'pass' : 'disagreement';
    }
  }
  const blockDeath = (why) => { if (deathCmd && deathCmd.ok) { deathCmd.ok = false; deathCmd.why = why; } };

  // ── Unreliable Power: one d6 per action instance, Death rolls once ───────
  if (unreliable) {
    if (deathCmd) { const r = roll(); deathCmd.roll = r; if (r <= 3) blockDeath('unreliable'); }
    for (const it of intents) { const r = roll(); it.roll = r; if (r <= 3) fail(it, 'unreliable'); }
  }

  // ── R0: hard suppressions ────────────────────────────────────────────────
  // Sleep Paralysis: paralysed players were never offered input (schema.blocked);
  // a paralysed active Death blocks the whole faction kill.
  if (team.some((id) => dreamOf(id) === 'SLEEP_PARALYSIS')) blockDeath('paralysis');
  const bards = intents.filter((it) => it.roleId === 'BARD' && it.option === 'SILENCE' && it.ok);
  const silenced = bards.length > 0;
  if (silenced) {
    for (const it of intents) if (it.roleId !== 'BARD') fail(it, 'silence');
    blockDeath('silence');
    ins('A song drifted through the dark and every power fell silent.');
  }

  // Protective sets used by several steps.
  const tempRev = new Set(m.players.filter((p) => p.alive && p.tempRevival).map((p) => p.id));
  const angel = new Set(N.aliveAtOpen.filter((id) => dreamOf(id) === 'GUARDIAN_ANGEL'));
  const blessed = new Set();
  for (const it of intents) if (it.roleId === 'WITCH' && it.option === 'BLESS' && it.ok) blessed.add(it.target);

  // ── Witch Curse (applied before any affected action takes effect) ────────
  // Spells resolve in one simultaneous pass: a curse never cancels another spell.
  const cursed = new Set();
  for (const it of intents) {
    if (it.roleId !== 'WITCH' || it.option !== 'CURSE' || !it.ok) continue;
    if (angel.has(it.target) || blessed.has(it.target) || tempRev.has(it.target)) { it.result = 'resisted'; continue; }
    cursed.add(it.target);
  }
  for (const t of cursed) {
    if (team.includes(t)) { blockDeath('curse'); continue; }
    const victimIntent = intents.find((x) => x.actorId === t && x.ok && x.target && x.roleId !== 'WITCH');
    if (victimIntent) fail(victimIntent, 'curse');
  }

  // ── Whore visits to an active Death actor ────────────────────────────────
  const visits = intents.filter((it) => it.roleId === 'WHORE' && it.ok);
  for (const v of visits) {
    if (team.includes(v.target)) blockDeath('visit');
  }

  // ── R2: conversions ──────────────────────────────────────────────────────
  const staged = {}; // pid -> { roleId?, alignment?, teamJoinNight?, powersFromNight?, mimicPowerless? }
  const alignNow = (id) => staged[id]?.alignment ?? byId(m, id).alignment;
  const roleNow = (id) => staged[id]?.roleId ?? byId(m, id).roleId;
  if (n === 1) {
    for (const p of m.players.filter((x) => aliveAtOpen.has(x.id) && x.roleId === 'DOUBLE_AGENT' && !x.daSettled)) {
      const it = intents.find((x) => x.actorId === p.id && x.roleId === 'DOUBLE_AGENT');
      const side = it && it.ok && it.option === 'DEATH' ? 'DEATH' : 'NON_DEATH';
      staged[p.id] = { ...(staged[p.id] || {}), alignment: side, daSettled: true, teamJoinNight: side === 'DEATH' ? n + 1 : null };
      if (it) ins(`${p.name} (Double Agent) made a secret pledge${it.ok ? '' : ' — but it never reached anyone'}.`);
      say(p.id, side === 'DEATH'
        ? 'Your pledge is sealed: you are now Death-aligned. You join the Death team room from Night 2.'
        : (it && it.ok ? 'Your pledge is sealed: you remain on the non-Death side.' : 'Your pledge was never made. You remain on the non-Death side for good.'), 'convert');
    }
    for (const p of m.players.filter((x) => aliveAtOpen.has(x.id) && x.roleId === 'MIMIC' && !x.mimicPowerless)) {
      const it = intents.find((x) => x.actorId === p.id && x.roleId === 'MIMIC');
      if (!it || !it.ok) {
        staged[p.id] = { mimicPowerless: true };
        say(p.id, 'The copy never took shape. You remain a powerless Mimic for the rest of the match.', 'convert');
        if (it) ins(`${p.name} (Mimic) reached for ${nameOf(m, it.target)}'s shape, but the copy failed.`);
        continue;
      }
      const tRole = roleNow(it.target);
      if (tRole === 'MIMIC') {
        staged[p.id] = { mimicPowerless: true };
        say(p.id, `You copied ${nameOf(m, it.target)} — another Mimic. You are left a powerless Mimic.`, 'convert');
        ins(`${p.name} (Mimic) copied ${nameOf(m, it.target)} and found only a mirror.`);
        continue;
      }
      const tAlign = alignNow(it.target);
      const charges = {};
      const def = ROLES[tRole];
      if (def.night?.charges) charges[tRole] = def.night.charges;
      if (def.day?.charges) charges[tRole] = def.day.charges;
      staged[p.id] = {
        roleId: tRole, alignment: tAlign, charges, copiedFrom: it.target, daSettled: true,
        teamJoinNight: tAlign === 'DEATH' ? n + 1 : null, powersFromNight: n + 1,
      };
      say(p.id, `You copied ${nameOf(m, it.target)}. You are now ${roleName(tRole)}${tAlign === 'DEATH' ? ' and Death-aligned — you join the Death team from Night 2' : ''}. Your new powers begin next night.`, 'convert');
      ins(`${p.name} (Mimic) copied ${nameOf(m, it.target)}.`);
    }
  }

  // ── R3: protections ──────────────────────────────────────────────────────
  const shield = new Set(intents.filter((it) => it.roleId === 'GUARDIAN' && it.ok).map((it) => it.target));
  const oracles = intents.filter((it) => it.roleId === 'ORACLE' && it.ok).map((it) => ({ ...it, used: false }));
  const bodyguards = intents.filter((it) => it.roleId === 'BODYGUARD' && it.ok);
  const bodyguardUsed = new Set();
  for (const it of intents.filter((x) => x.roleId === 'GUARDIAN')) {
    ins(it.ok ? `${nameOf(m, it.actorId)} (Guardian) watched over ${nameOf(m, it.target)}.` : `${nameOf(m, it.actorId)} (Guardian) tried to watch over ${nameOf(m, it.target)} but failed.`);
    if (it.ok) say(it.actorId, `You watched over ${nameOf(m, it.target)} through the night.`);
  }
  for (const it of intents.filter((x) => x.roleId === 'WITCH')) {
    const verb = it.option === 'BLESS' ? 'blessed' : 'cursed';
    if (!it.ok) { ins(`${nameOf(m, it.actorId)} (Witch) tried to cast on ${nameOf(m, it.target)} but the spell failed.`); continue; }
    ins(`${nameOf(m, it.actorId)} (Witch) ${verb} ${nameOf(m, it.target)}${it.result === 'resisted' ? ', but the curse found no purchase' : ''}.`);
    say(it.actorId, it.result === 'resisted' ? `Your curse on ${nameOf(m, it.target)} found no purchase.` : `You ${verb} ${nameOf(m, it.target)}.`);
  }

  // ── R4: Death faction kill ───────────────────────────────────────────────
  const deaths = new Map(); // pid -> [causes]
  const kill = (pid, cause) => { if (!deaths.has(pid)) deaths.set(pid, []); deaths.get(pid).push(cause); };
  const deathKilled = new Set();
  const protectedFromDeath = (t) => {
    if (tempRev.has(t)) return 'revival';
    if (angel.has(t)) return 'angel';
    if (blessed.has(t)) return 'bless';
    if (shield.has(t)) return 'guardian';
    return null;
  };
  if (deathCmd) {
    if (!deathCmd.ok) {
      ins(`The Death faction chose ${deathCmd.targets.map((t) => nameOf(m, t)).join(' and ')}, but their hand was stayed.`);
      for (const id of team) say(id, 'Your kill did not land. Something stayed your hand tonight.', 'death');
    } else {
      const fell = [];
      for (const t of deathCmd.targets) {
        if (!aliveAtOpen.has(t)) continue;
        const prot = protectedFromDeath(t);
        if (prot) { ins(`Death came for ${nameOf(m, t)}, but they were protected.`); continue; }
        const oracle = oracles.find((o) => !o.used && o.target === t);
        if (oracle) { oracle.used = true; oracle.saved = true; ins(`Death came for ${nameOf(m, t)}, but an Oracle had foreseen it.`); continue; }
        const bg = bodyguards.find((b) => b.target === t && !bodyguardUsed.has(b.actorId) && b.actorId !== t);
        if (bg) {
          bodyguardUsed.add(bg.actorId);
          const bprot = protectedFromDeath(bg.actorId);
          if (bprot) { ins(`${nameOf(m, bg.actorId)} (Bodyguard) stepped in front of Death for ${nameOf(m, t)} — and survived.`); continue; }
          kill(bg.actorId, 'BODYGUARD_SACRIFICE');
          deathKilled.add(bg.actorId);
          fell.push(bg.actorId);
          ins(`${nameOf(m, bg.actorId)} (Bodyguard) took Death's blade meant for ${nameOf(m, t)}.`);
          continue;
        }
        kill(t, 'KILLED_BY_DEATH');
        deathKilled.add(t);
        fell.push(t);
        ins(`The Death faction killed ${nameOf(m, t)}.`);
      }
      for (const id of team) {
        say(id, fell.length ? `Your blade found ${fell.map((x) => nameOf(m, x)).join(' and ')}.` : 'Your target survived the night.', 'death');
      }
    }
  } else if (team.length) {
    ins('The Death faction did not agree on a target.');
    for (const id of team) say(id, deathWhy === 'pass' ? 'Your team chose to pass tonight.' : 'Your team never agreed on a target, so nobody was killed by Death.', 'death');
  }

  // ── R5: Psycho statuses ──────────────────────────────────────────────────
  const queuedStatuses = [];
  for (const it of intents.filter((x) => x.roleId === 'PSYCHO')) {
    const label = it.option === 'MUTE' ? 'Mute' : 'No Vote';
    if (!it.ok) { ins(`${nameOf(m, it.actorId)} (Psycho) tried to mark ${nameOf(m, it.target)} but failed.`); say(it.actorId, failText(it.why)); continue; }
    if (deaths.has(it.target)) { say(it.actorId, `${nameOf(m, it.target)} did not live to bear your mark.`); continue; }
    if (tempRev.has(it.target) || angel.has(it.target) || blessed.has(it.target) || shield.has(it.target)) {
      ins(`${nameOf(m, it.actorId)} (Psycho) tried to ${label} ${nameOf(m, it.target)}, but they were protected.`);
      say(it.actorId, `Your mark on ${nameOf(m, it.target)} did not take.`);
      continue;
    }
    queuedStatuses.push({ type: it.option, targetId: it.target, day: n + 1, origin: 'PSYCHO' });
    ins(`${nameOf(m, it.actorId)} (Psycho) marked ${nameOf(m, it.target)} with ${label}.`);
    say(it.actorId, `${nameOf(m, it.target)} will suffer ${label} tomorrow.`);
  }

  // ── R6: bombs and other actions ──────────────────────────────────────────
  const bombProtected = (t) => tempRev.has(t) || angel.has(t) || blessed.has(t);
  for (const it of intents.filter((x) => x.roleId === 'TERRORIST')) {
    if (!it.ok) { ins(`${nameOf(m, it.actorId)} (Terrorist) failed to plant a bomb at ${nameOf(m, it.target)}'s door.`); say(it.actorId, failText(it.why)); continue; }
    const yes = rng.int(2, 'bomb') === 1;
    if (!yes) {
      ins(`${nameOf(m, it.actorId)} (Terrorist) planted a bomb at ${nameOf(m, it.target)}'s door. It did not go off.`);
      say(it.actorId, `Your bomb at ${nameOf(m, it.target)}'s door stayed silent.`);
      continue;
    }
    ins(`${nameOf(m, it.actorId)} (Terrorist) bombed ${nameOf(m, it.target)}'s door — it exploded.`);
    say(it.actorId, `Your bomb at ${nameOf(m, it.target)}'s door exploded.`);
    if (bombProtected(it.target)) ins(`${nameOf(m, it.target)} walked out of the smoke unharmed.`);
    else kill(it.target, 'BOMB');
    for (const v of visits.filter((x) => x.target === it.target && x.actorId !== it.target)) {
      if (bombProtected(v.actorId)) { ins(`${nameOf(m, v.actorId)} was caught in the blast but survived.`); continue; }
      kill(v.actorId, 'BOMB_BLAST');
      ins(`${nameOf(m, v.actorId)} (Whore) was caught in the blast.`);
    }
  }
  for (const v of intents.filter((x) => x.roleId === 'WHORE')) {
    if (!v.ok) { ins(`${nameOf(m, v.actorId)} (Whore) never made it to ${nameOf(m, v.target)}.`); say(v.actorId, failText(v.why)); continue; }
    ins(`${nameOf(m, v.actorId)} (Whore) visited ${nameOf(m, v.target)}.`);
    say(v.actorId, `You spent the night with ${nameOf(m, v.target)}.`);
  }
  for (const it of intents.filter((x) => x.roleId === 'TRAVELING_AGENT')) {
    if (!it.ok) { ins(`${nameOf(m, it.actorId)} (Traveling Agent) failed to deliver to ${nameOf(m, it.target)}.`); say(it.actorId, failText(it.why)); continue; }
    const product = pick(rng, PRODUCTS, 'product');
    ins(`${nameOf(m, it.actorId)} (Traveling Agent) delivered ${product} to ${nameOf(m, it.target)}.`);
    say(it.actorId, `You delivered ${product} to ${nameOf(m, it.target)}.`);
    say(it.target, `A Traveling Agent visited you. You received ${product}.`, 'gift');
  }
  for (const it of intents.filter((x) => x.roleId === 'MENTALIST')) {
    if (!it.ok) { ins(`${nameOf(m, it.actorId)} (Mentalist) reached for ${nameOf(m, it.target)}'s mind but found nothing.`); say(it.actorId, failText(it.why)); continue; }
    const isDeath = alignNow(it.target) === 'DEATH';
    ins(`${nameOf(m, it.actorId)} (Mentalist) read ${nameOf(m, it.target)}.`);
    say(it.actorId, `${nameOf(m, it.target)} is ${isDeath ? 'DEATH-ALIGNED' : 'NOT DEATH-ALIGNED'}.`, isDeath ? 'alarm' : 'clear');
  }
  for (const o of oracles) {
    ins(`${nameOf(m, o.actorId)} (Oracle) foresaw an attack on ${nameOf(m, o.target)}${o.saved ? ' — and it came true' : ''}.`);
    say(o.actorId, o.saved ? `Your vision was true: Death came for ${nameOf(m, o.target)}, and your foresight turned it away.` : `Death did not come for ${nameOf(m, o.target)} tonight. Your vision is spent.`);
  }
  for (const it of intents.filter((x) => x.roleId === 'ORACLE' && !x.ok)) say(it.actorId, failText(it.why));
  for (const it of intents.filter((x) => x.roleId === 'BODYGUARD')) {
    if (!it.ok) { say(it.actorId, failText(it.why)); continue; }
    if (!bodyguardUsed.has(it.actorId)) { ins(`${nameOf(m, it.actorId)} (Bodyguard) stood guard over ${nameOf(m, it.target)}.`); say(it.actorId, `You stood guard over ${nameOf(m, it.target)}. Nothing came.`); }
  }
  for (const it of intents.filter((x) => x.roleId === 'GAMBLER')) {
    if (!it.ok) { say(it.actorId, failText(it.why)); continue; }
    m.gamblerBets.push({ actorId: it.actorId, targetId: it.target, day: n + 1 });
    ins(`${nameOf(m, it.actorId)} (Gambler) placed a bet on ${nameOf(m, it.target)}.`);
    say(it.actorId, `Your bet is placed: ${nameOf(m, it.target)} to be nominated first tomorrow.`);
  }
  for (const it of intents.filter((x) => x.roleId === 'BARD')) {
    if (!it.ok) { say(it.actorId, failText(it.why)); continue; }
    say(it.actorId, 'Your song silenced the night.');
  }
  for (const it of intents.filter((x) => (x.roleId === 'GUARDIAN' || x.roleId === 'WITCH') && !x.ok)) {
    say(it.actorId, failText(it.why));
  }

  // ── R7: temporary revivals (Necromancer must survive R4/R6) ──────────────
  const revivals = [];
  for (const it of intents.filter((x) => x.roleId === 'NECROMANCER')) {
    if (!it.ok) { say(it.actorId, failText(it.why)); continue; }
    if (deaths.has(it.actorId)) { ins(`${nameOf(m, it.actorId)} (Necromancer) died before the ritual was complete.`); continue; }
    const t = byId(m, it.target);
    if (!t || t.alive || t.revivedOnce || revivals.includes(t.id)) { say(it.actorId, 'The ritual found nothing to raise.'); continue; }
    revivals.push(t.id);
    ins(`${nameOf(m, it.actorId)} (Necromancer) raised ${t.name} from the grave.`);
    say(it.actorId, `${t.name} rises at dawn — for one Day and one Night.`);
  }

  // ── R8: linked fates to a fixed point, then revival expiry ───────────────
  const linkProtected = (t) => tempRev.has(t) || angel.has(t);
  let changed = true;
  let guard = 0;
  while (changed && guard++ <= m.players.length + 2) {
    changed = false;
    for (const v of visits) {
      if (deathKilled.has(v.target) && v.actorId !== v.target && !deaths.has(v.actorId) && !linkProtected(v.actorId)) {
        kill(v.actorId, 'VISIT_COLLATERAL'); changed = true;
        ins(`${nameOf(m, v.actorId)} (Whore) died alongside ${nameOf(m, v.target)}.`);
      }
    }
    for (const [holder, partner] of Object.entries(N.nightmare)) {
      if (dreamOf(holder) !== 'SHARED_NIGHTMARE' || !aliveAtOpen.has(holder) || deaths.has(holder)) continue;
      if (deaths.has(partner)) {
        if (linkProtected(holder)) { ins(`${nameOf(m, holder)} woke screaming from a shared nightmare — but lived.`); continue; }
        kill(holder, 'SHARED_NIGHTMARE'); changed = true;
        ins(`${nameOf(m, holder)} never woke from the nightmare shared with ${nameOf(m, partner)}.`);
      }
    }
    for (const [holder, partner] of Object.entries(N.sleepwalk)) {
      if (dreamOf(holder) !== 'SLEEPWALKING' || !aliveAtOpen.has(holder) || !aliveAtOpen.has(partner) || deaths.has(holder)) continue;
      if (deaths.has(partner)) {
        if (linkProtected(holder)) continue;
        kill(holder, 'SLEEPWALK_LINK'); changed = true;
        ins(`${nameOf(m, holder)} sleepwalked after ${nameOf(m, partner)} and did not come back.`);
      }
    }
  }
  // Revived players are immune: drop any recorded death for them (defensive).
  for (const id of tempRev) deaths.delete(id);
  const expired = m.players.filter((p) => p.alive && p.tempRevival && p.tempRevival.expiresAfterNight === n).map((p) => p.id);

  // ── Atomic commit ────────────────────────────────────────────────────────
  for (const [pid, change] of Object.entries(staged)) Object.assign(byId(m, pid), change);
  for (const [pid, causes] of deaths) {
    const p = byId(m, pid);
    p.alive = false; p.diedAt = `Night ${n}`; p.causes = causes;
  }
  for (const pid of expired) {
    const p = byId(m, pid);
    p.alive = false; p.tempRevival = null; p.diedAt = `Night ${n}`; p.causes = ['REVIVAL_EXPIRED'];
  }
  for (const pid of revivals) {
    const p = byId(m, pid);
    p.alive = true; p.revivedOnce = true; p.tempRevival = { expiresAfterNight: n + 1 }; p.statuses = [];
  }
  m.pendingStatuses.push(...queuedStatuses.filter((s) => byId(m, s.targetId).alive));

  // ── R9: reports for survivors only ───────────────────────────────────────
  const survivors = m.players.filter((p) => p.alive);
  for (const p of survivors) {
    const d = dreamOf(p.id);
    if (d === 'PREMONITION') {
      const pool = survivors.filter((x) => x.alignment === 'DEATH');
      const choices = pool.length > 1 ? pool.filter((x) => x.id !== p.id) : pool;
      if (choices.length) say(p.id, `Premonition: ${pick(rng, choices, 'premonition').name} walks with Death.`, 'alarm');
      else say(p.id, 'Premonition: no vision came.', 'dream');
    } else if (d === 'WHISPERS') {
      const dead = m.players.filter((x) => !x.alive);
      if (dead.length) { const x = pick(rng, dead, 'whisper'); say(p.id, `Whispers of the Past: ${x.name} was ${roleName(x.roleId)}.`, 'dream'); }
      else say(p.id, 'Whispers of the Past: the past is silent.', 'dream');
    } else if (d === 'INSOMNIA') {
      say(p.id, insomnia.length ? `Insomnia — you lay awake and saw everything:\n• ${insomnia.join('\n• ')}` : 'Insomnia — you lay awake all night. Nothing stirred.', 'insomnia');
    }
  }
  for (const [pid, list] of Object.entries(reports)) {
    if (!byId(m, pid).alive) continue;
    for (const r of list) priv(m, pid, r.text, r.kind);
  }

  // Public dawn notice: final state only, never priority order or roles.
  const fallen = [...deaths.keys(), ...expired];
  const reveal = m.settings.revealOnDeath && !hasRule(m, 'HIDDEN_ROLES');
  const names = (ids) => ids.map((id) => nameOf(m, id) + (reveal ? ` (${roleName(byId(m, id).roleId)})` : '')).join(', ');
  if (fallen.length === 0) pub(m, `Dawn of Day ${n + 1}. The night passed and everyone woke up.`, 'dawn');
  else pub(m, `Dawn of Day ${n + 1}. Found dead: ${names([...deaths.keys()]) || '—'}${expired.length ? `. Their borrowed time ran out: ${names(expired)}` : ''}.`, 'death', { victims: fallen });
  if (revivals.length) pub(m, `${revivals.map((id) => nameOf(m, id)).join(', ')} returned from the grave — until the next dawn.`, 'revive');
  return { deaths: [...deaths.keys()], expired, revivals, statuses: queuedStatuses };
}

function failText(why) {
  switch (why) {
    case 'unreliable': return 'Your power faltered tonight (Unreliable Power).';
    case 'silence': return 'A strange silence swallowed your power tonight.';
    case 'curse': return 'Your action fizzled.';
    default: return 'Your action had no effect.';
  }
}

export { DREAMS };
