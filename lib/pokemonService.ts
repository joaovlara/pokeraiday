import { Pokemon, Move } from "@/types/pokemon";

export async function fetchPokemon(name: string): Promise<Pokemon | null> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar Pokémon:", error);
    return null;
  }
}

export async function fetchBothPokemon(
  p1Name: string,
  p2Name: string,
): Promise<[Pokemon | null, Pokemon | null]> {
  const [p1, p2] = await Promise.all([fetchPokemon(p1Name), fetchPokemon(p2Name)]);
  return [p1, p2];
}

export async function fetchMovePower(moveUrl: string): Promise<number | null> {
  try {
    const res = await fetch(moveUrl);
    if (!res.ok) return null;
    const data = await res.json();
    return data.power; // pode ser null
  } catch {
    return null;
  }
}
