import { PokemonEntity } from "../entities/pokemon.entity";
import { BossEntity } from "../entities/boss.entity";
import { calculateDamage } from "@/utils/damage";

export interface ActionLog {
  actor: string;
  target: string;
  move: string;
  damage: number;
  remainingHP: number;
}

export interface RoundResult {
  logs: ActionLog[];
  bossHp: number;
  teamHp: Record<string, number>;
  winner: "player" | "boss" | null;
}

/**
 * Ataque do jogador: aplica o golpe escolhido no Boss
 */
export function playerAttack(
  attacker: PokemonEntity,
  boss: BossEntity,
  move: any
): { updatedBoss: BossEntity; logs: ActionLog[] } {
  const logs: ActionLog[] = [];

  const damage = calculateDamage(attacker, boss, move);
  const newBossHp = Math.max(boss.hp - damage, 0);

  logs.push({
    actor: attacker.name,
    target: boss.name,
    move: move.name,
    damage,
    remainingHP: newBossHp,
  });

  const updatedBoss = { ...boss, hp: newBossHp };

  return { updatedBoss, logs };
}

/**
 * Contra-ataque do Boss: 1 ataque garantido + chance extra
 */
export function bossCounterAttack(
  boss: BossEntity,
  team: PokemonEntity[],
  extraChance: number = 0.1
): ActionLog[] {
  const logs: ActionLog[] = [];
  const aliveTeam = team.filter((p) => p.hp > 0);

  if (boss.hp > 0 && aliveTeam.length > 0) {
    // ataque garantido
    const target = aliveTeam[Math.floor(Math.random() * aliveTeam.length)];
    const move = boss.moves[Math.floor(Math.random() * boss.moves.length)];
    const damage = calculateDamage(boss, target, move);
    target.hp = Math.max(0, target.hp - damage);

    logs.push({
      actor: boss.name,
      target: target.name,
      move: move.name,
      damage,
      remainingHP: target.hp,
    });

    // chance extra
    if (Math.random() < extraChance) {
      const extraTarget = aliveTeam[Math.floor(Math.random() * aliveTeam.length)];
      const extraMove = boss.moves[Math.floor(Math.random() * boss.moves.length)];
      const extraDamage = calculateDamage(boss, extraTarget, extraMove);
      extraTarget.hp = Math.max(0, extraTarget.hp - extraDamage);

      logs.push({
        actor: boss.name,
        target: extraTarget.name,
        move: extraMove.name,
        damage: extraDamage,
        remainingHP: extraTarget.hp,
      });
    }
  }

  return logs;
}

/**
 * Checagem de vitória após cada turno
 */
export function checkWinner(
  boss: BossEntity,
  team: PokemonEntity[]
): "player" | "boss" | null {
  if (boss.hp <= 0) return "player";
  if (team.every((p) => p.hp <= 0)) return "boss";
  return null;
}
