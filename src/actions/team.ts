import { PokemonAPI } from "@/schemas/pokemon.schema";
import { toPokemonEntity } from "@/entities/pokemon";

export async function createAttackers(count: number = 8) {
  const attackers: any[] = [];

  for (let i = 0; i < count; i++) {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data: PokemonAPI = await res.json();

    // nível aleatório até 70
    const randomLevel = Math.floor(Math.random() * 70) + 1;
    const entity = await toPokemonEntity(data, randomLevel);

    attackers.push(entity);
  }

  return attackers;
}
