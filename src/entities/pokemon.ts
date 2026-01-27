import { PokemonAPI } from "../schemas/pokemon.schema";

export interface PokemonEntity {
  id: number;
  name: string;
  sprite: string | null;
  level: number;
  stats: Record<string, number>;
  types: string[];
  hp: number;
}

export function toPokemonEntity(apiData: PokemonAPI, level: number): PokemonEntity {
  return {
    id: apiData.id,
    name: apiData.name,
    sprite: apiData.sprites.front_default,
    level,
    stats: apiData.stats.reduce((acc, s) => {
      acc[s.stat.name] = s.base_stat;
      return acc;
    }, {} as Record<string, number>),
    types: apiData.types.map(t => t.type.name),
    hp: apiData.stats.find(s => s.stat.name === "hp")?.base_stat ?? 100,
  };
}
