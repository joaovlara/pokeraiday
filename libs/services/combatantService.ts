// libs/services/combatantService.ts
import { RawPokemon, buildCombatant, buildCombatantAsync, Combatant } from "../pokemonUtils";

export function buildBossCombatant(raw: RawPokemon) {
  return buildCombatant(raw, 100, 31, true);
}

export function buildCandidateCombatant(raw: RawPokemon, level: number) {
  return buildCombatant(raw, level, 31, false);
}

export async function buildBossCombatantAsync(raw: RawPokemon) {
  return buildCombatantAsync(raw, 100, 31, true);
}

export async function buildCandidateCombatantAsync(raw: RawPokemon, level: number) {
  return buildCombatantAsync(raw, level, 31, false);
}

export function isTeamDead(team: Combatant[]): boolean {
  return team.every((t) => t.hp <= 0);
}

export function isBossDead(boss: Combatant | null): boolean {
  return !boss || boss.hp <= 0;
}
