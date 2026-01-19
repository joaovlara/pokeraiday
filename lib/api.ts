import { Pokemon } from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

export async function fetchPokemon(name: string): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/${name.toLowerCase()}`);
  if (!res.ok) throw new Error("Pokémon não encontrado");
  return res.json();
}

export async function fetchMultiplePokemon(names: string[]): Promise<Pokemon[]> {
  try {
    const promises = names.map((name) => fetchPokemon(name));
    return await Promise.all(promises);
  } catch (error) {
    throw new Error("Erro ao buscar Pokémons");
  }
}
