import { fetchPokemon } from "../services/pokeapi";
import { toPokemonEntity, PokemonEntity } from "../entities/pokemon";
import { randomInt } from "../utils/random";

export async function createAttackers(count = 8): Promise<PokemonEntity[]> {
  const attackers: PokemonEntity[] = [];
  for (let i = 0; i < count; i++) {
    const apiData = await fetchPokemon(randomInt(1, 898));
    const level = randomInt(18, 80);
    attackers.push(toPokemonEntity(apiData, level));
  }
  return attackers;
}
