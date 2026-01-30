import { calculateHp, calculateStat } from "@/utils/stats";
import { PokemonAPI } from "../schemas/pokemon.schema";
import { Attack } from "./pokemon.entity";
import { getRandomMoves } from "@/utils/moves";

export interface BossEntity {
  id: number;
  name: string;
  sprite: string | null;
  types: string[];
  level: number;
  stats: Record<string, number>;
  hp: number;
  maxHp: number;
  moves: Attack[];
}

export async function toBossEntity(apiData: PokemonAPI): Promise<BossEntity> {
  const level = 100;

  const baseHp = apiData.stats.find((s) => s.stat.name === "hp")?.base_stat ?? 100;
  const maxHp = calculateHp(baseHp, level);

  const stats = apiData.stats.reduce((acc, s) => {
    if (s.stat.name === "hp") {
      acc.hp = calculateHp(s.base_stat, level);
    } else {
      acc[s.stat.name] = calculateStat(s.base_stat, level);
    }
    return acc;
  }, {} as Record<string, number>);

  return {
    id: apiData.id,
    name: apiData.name.toUpperCase(),
    sprite:
      apiData.sprites.other?.["official-artwork"].front_default ??
      apiData.sprites.front_default,
    types: apiData.types.map((t) => t.type.name),
    level,
    stats,
    hp: maxHp,
    maxHp,
    moves: await getRandomMoves(apiData, 3), // Boss com 3 moves
  };
}
