import { Attack } from "@/entities/pokemon.entity";

export async function fetchMove(name: string): Promise<Attack> {
  const res = await fetch(`https://pokeapi.co/api/v2/move/${name}`);
  const data = await res.json();
  return {
    name: data.name,
    type: data.type.name,
    power: data.power ?? 50, // fallback
  };
}

export async function getRandomMoves(apiData: any, count: number = 4): Promise<Attack[]> {
  const shuffled = apiData.moves.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  const moves = await Promise.all(selected.map((m: any) => fetchMove(m.move.name)));
  return moves.filter((m) => m.power > 0);
}
