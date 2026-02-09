import { fetchPokemon } from "../services/pokeapi";
import { toPokemonEntity } from "../entities/pokemon.entity";
import { randomInt } from "../utils/random";
import { PokemonEntity } from "@/entities/pokemon.entity";

export async function createBoss(): Promise<PokemonEntity> {
  const apiData = await fetchPokemon(randomInt(1, 1024));
  return toPokemonEntity(apiData, 100); // Boss sempre lvl 100
}

export async function createAttackers(count = 8): Promise<PokemonEntity[]> {
  // Cria um array de promessas e resolve todas em paralelo
  const promises: Promise<PokemonEntity>[] = Array.from(
    { length: count },
    async () => {
      const apiData = await fetchPokemon(randomInt(1, 1024));
      const level = randomInt(18, 80);
      return toPokemonEntity(apiData, level);
    },
  );

  // Aguarda todas as promessas e retorna o array resolvido
  const attackers = await Promise.all(promises);
  return attackers;
}
