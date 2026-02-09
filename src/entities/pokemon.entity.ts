import { PokemonAPI } from "../schemas/pokemon.schema";
import { calculateHp, calculateStat } from "@/utils/stats";
import { getRandomMoves } from "@/utils/moves";

export interface Attack {
  name: string;
  type: string;
  power: number;
}

export interface PokemonEntity {
  id: number;
  name: string;
  sprite: string | null;
  level: number;
  stats: Record<string, number>;
  types: string[];
  hp: number;
  maxHp: number;
  moves: Attack[];
}

export async function toPokemonEntity(
  apiData: PokemonAPI,
  level: number,
): Promise<PokemonEntity> {
  const baseHp =
    apiData.stats.find((s) => s.stat.name === "hp")?.base_stat ?? 50;
  const maxHp = calculateHp(baseHp, level);

  const stats = apiData.stats.reduce(
    (acc, s) => {
      if (s.stat.name === "hp") {
        acc.hp = calculateHp(s.base_stat, level);
      } else {
        acc[s.stat.name] = calculateStat(s.base_stat, level);
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    id: apiData.id,
    name: apiData.name,
    sprite:
      apiData.sprites.other?.["official-artwork"].front_default ??
      apiData.sprites.front_default,
    level,
    stats,
    types: apiData.types.map((t) => t.type.name),
    hp: maxHp,
    maxHp,
    moves: await getRandomMoves(apiData, 4), // Player Pokémon com 4 moves
  };
}
