import { PokemonAPI } from "../schemas/pokemon.schema";

export interface BossEntity {
  id: number;
  name: string;
  sprite: string | null;
  types: string[];
  level: number;
  stats: Record<string, number>;
  hp: number;
  maxHp: number; // adiciona vida máxima
}

export function toBossEntity(apiData: PokemonAPI): BossEntity {
  // pega o HP base da API
  const baseHp = apiData.stats.find((s) => s.stat.name === "hp")?.base_stat ?? 100;

  // multiplicador fixo de 100
  const maxHp = baseHp * 100;

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
        acc[s.stat.name] = s.base_stat; // mantém stats originais
        return acc;
      },
      {} as Record<string, number>,
    ),
    hp: maxHp,     // vida atual começa cheia
    maxHp: maxHp,  // vida máxima
  };
}
