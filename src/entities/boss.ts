import { PokemonAPI } from "../schemas/pokemon.schema";

export interface BossEntity {
  id: number;
  name: string;
  sprite: string | null;
  types: string[];
  level: number;
  stats: Record<string, number>;
  hp: number;
}

export function toBossEntity(apiData: PokemonAPI): BossEntity {
  return {
    id: apiData.id,
    name: apiData.name.toUpperCase(),
    sprite:
      apiData.sprites.other?.["official-artwork"].front_default ??
      apiData.sprites.front_default,
    types: apiData.types.map((t) => t.type.name),
    level: 100,
    stats: apiData.stats.reduce(
      (acc, s) => {
        acc[s.stat.name] = 999;
        return acc;
      },
      {} as Record<string, number>,
    ),
    hp: 999,
  };
}
