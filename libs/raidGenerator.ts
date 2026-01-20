import {
  buildBossCombatant,
  buildBossCombatantAsync,
  buildCandidateCombatant,
  buildCandidateCombatantAsync,
} from "./services/combatantService";

// Re-export para manter compatibilidade com código antigo
export {
  buildBossCombatant,
  buildBossCombatantAsync,
  buildCandidateCombatant,
  buildCandidateCombatantAsync,
};

// Deprecated: use libs/services/pokemonApi instead
export async function generateBossRaw() {
  const { generateBossRaw } = await import("./services/pokemonApi");
  return generateBossRaw();
}

export async function generateCandidatesRaw(count?: number, maxLevel?: number) {
  const { generateCandidatesRaw } = await import("./services/pokemonApi");
  return generateCandidatesRaw(count, maxLevel);
}

