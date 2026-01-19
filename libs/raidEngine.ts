import { Combatant, calcDamage, fetchMovePower } from "./pokemonUtils";

export type RaidState = {
  boss: Combatant;
  team: Combatant[]; // length 5
  log: string[];
  round: number;
  finished: boolean;
  winner?: "player" | "boss";
};

export function initialRaidState(boss: Combatant, team: Combatant[]): RaidState {
  return { boss, team, log: [], round: 0, finished: false };
}

function appendLog(state: RaidState, text: string) {
  state.log.unshift(text);
  if (state.log.length > 200) state.log.pop();
}

export async function runRound(state: RaidState, onUpdate?: (s: RaidState) => void) {
  if (state.finished) return state;
  state.round += 1;

  // montar participantes vivos
  const participants: { actor: Combatant; type: "boss" | "ally" }[] = [];
  if (state.boss.hp > 0) participants.push({ actor: state.boss, type: "boss" });
  state.team.forEach((t) => { if (t.hp > 0) participants.push({ actor: t, type: "ally" }); });

  // ordenar por speed desc
  participants.sort((a, b) => b.actor.spd - a.actor.spd);

  for (const p of participants) {
    // checar fim
    if (state.boss.hp <= 0) {
      state.finished = true;
      state.winner = "player";
      appendLog(state, `Boss ${state.boss.name} foi derrotado.`);
      break;
    }
    if (state.team.every((t) => t.hp <= 0)) {
      state.finished = true;
      state.winner = "boss";
      appendLog(state, `Toda a equipe foi derrotada.`);
      break;
    }

    if (p.type === "ally") {
      const attacker = p.actor;
      if (attacker.hp <= 0) continue;
      // escolher movimento: tenta usar primeiro move; busca power se tiver url
      let power = 50;
      const move = attacker.moves[0];
      if (move && (move as any).url) {
        const mp = await fetchMovePower((move as any).url);
        if (mp) power = mp;
      } else if ((move as any).power) {
        power = (move as any).power;
      }
      const damage = calcDamage(attacker, state.boss, power);
      state.boss.hp = Math.max(0, state.boss.hp - damage);
      appendLog(state, `${attacker.name} causou ${damage} a Boss ${state.boss.name}.`);
      if (onUpdate) onUpdate(state);
    } else {
      // boss ataca alvo aleatório vivo
      const alive = state.team.filter((t) => t.hp > 0);
      if (alive.length === 0) break;
      const target = alive[Math.floor(Math.random() * alive.length)];
      // boss usa primeiro move se tiver power, senão power default 60
      let power = 60;
      const move = state.boss.moves[0];
      if (move && (move as any).url) {
        const mp = await fetchMovePower((move as any).url);
        if (mp) power = mp;
      } else if ((move as any).power) {
        power = (move as any).power;
      }
      const damage = calcDamage(state.boss, target, power);
      target.hp = Math.max(0, target.hp - damage);
      appendLog(state, `Boss ${state.boss.name} causou ${damage} a ${target.name}.`);
      if (onUpdate) onUpdate(state);
    }

    // checagens rápidas de fim após cada ação
    if (state.boss.hp <= 0) {
      state.finished = true;
      state.winner = "player";
      appendLog(state, `Boss ${state.boss.name} foi derrotado.`);
      break;
    }
    if (state.team.every((t) => t.hp <= 0)) {
      state.finished = true;
      state.winner = "boss";
      appendLog(state, `Toda a equipe foi derrotada.`);
      break;
    }
  }

  return state;
}
