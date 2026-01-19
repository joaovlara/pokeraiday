import { RawPokemon, buildCombatant } from "./pokemonUtils";

const MAX_POKEMON_ID = 898; // ajuste se quiser limitar gerações

async function fetchPokemonByIdOrName(idOrName: number | string): Promise<RawPokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
  if (!res.ok) throw new Error("Erro ao buscar Pokémon");
  return res.json();
}

export async function generateBossRaw(): Promise<RawPokemon> {
  const id = Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
  return fetchPokemonByIdOrName(id);
}

export async function generateCandidatesRaw(count = 8, maxLevel = 70) {
  const promises = Array.from({ length: count }).map(async () => {
    const id = Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
    const raw = await fetchPokemonByIdOrName(id);
    const level = Math.floor(Math.random() * maxLevel) + 1;
    return { raw, level };
  });
  return Promise.all(promises);
}

// helpers para construir Combatant já prontos
export function buildBossCombatant(raw: RawPokemon) {
  return buildCombatant(raw, 100, 31, true);
}

export function buildCandidateCombatant(raw: RawPokemon, level: number) {
  return buildCombatant(raw, level, 31, false);
}
