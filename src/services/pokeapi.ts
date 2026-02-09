import { PokemonSchema } from "../schemas/pokemon.schema";
import { randomInt } from "../utils/random";

export async function fetchPokemon(id: number) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();
  return PokemonSchema.parse(data);
}
