import { fetchPokemon } from "../services/pokeapi";
import { toPokemonEntity, PokemonEntity } from "../entities/pokemon";
import { randomInt } from "../utils/random";

export async function createAttackers(count = 8): Promise<PokemonEntity[]> {
  const attackers: PokemonEntity[] = [];
  const usedIds = new Set<number>();

  while (attackers.length < count) {
    const id = randomInt(1, 1.025);

    if (usedIds.has(id)) continue;

    const apiData = await fetchPokemon(id);
    const level = randomInt(18, 80);
    attackers.push(toPokemonEntity(apiData, level));
    usedIds.add(id);
  }

  return attackers;
}
