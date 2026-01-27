import { PokemonSchema } from "../schemas/pokemon.schema";
import { randomInt } from "../utils/random";

export async function fetchPokemon(id: number) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();
  return PokemonSchema.parse(data);
}

export async function fetchRandomPokemon() {
  const id = randomInt(1, 898); // total de pokémons na POKEAPI
  return fetchPokemon(id);
}
