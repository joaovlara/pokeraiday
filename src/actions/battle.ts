import { fetchPokemon } from "../services/pokeapi";
import { toPokemonEntity } from "../entities/pokemon.entity";
import { randomInt } from "../utils/random";

export async function createBoss() {
  const apiData = await fetchPokemon(randomInt(1, 1024));
  return toPokemonEntity(apiData, 100); // Boss sempre lvl 100
}

export async function createAttackers(count = 8) {
  const attackers = [];
  for (let i = 0; i < count; i++) {
    const apiData = await fetchPokemon(randomInt(1, 1024));
    const level = randomInt(18, 80);
    attackers.push(toPokemonEntity(apiData, level));
  }
  return attackers;
}
