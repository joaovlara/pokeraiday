import { PokemonAPI } from "@/schemas/pokemon.schema";
import { toBossEntity } from "@/entities/boss";

export async function createBoss() {
  // sorteia um Pokémon aleatório da PokéAPI
  const randomId = Math.floor(Math.random() * 898) + 1;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  const data: PokemonAPI = await res.json();

  // transforma em BossEntity (lvl 100, IV=31)
  const bossEntity = await toBossEntity(data);
  return bossEntity;
}
