import { PokemonAPI } from "../schemas/pokemon.schema";

export interface Attack {
  name: string;
  type: string;
  power: number; // dano base
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

function getRandomMoves(apiData: PokemonAPI, count: number = 4): Attack[] {
  // Filtra apenas moves com power definido
  const validMoves = apiData.moves.filter((m: any) => m.move.power);

  // Embaralha a lista
  const shuffled = validMoves.sort(() => 0.5 - Math.random());

  // Pega os primeiros "count" após embaralhar
  return shuffled.slice(0, count).map((m: any) => ({
    name: m.move.name,
    type: m.move.type.name,
    power: m.move.power,
  }));
}

export function toPokemonEntity(apiData: PokemonAPI, level: number): PokemonEntity {
  const baseHp = apiData.stats.find((s) => s.stat.name === "hp")?.base_stat ?? 50;
  const maxHp = baseHp * level;

  return {
    id: apiData.id,
    name: apiData.name,
    sprite: apiData.sprites.front_default,
    level,
    stats: apiData.stats.reduce((acc, s) => {
      acc[s.stat.name] = s.base_stat * level; // escala stats pelo nível
      return acc;
    }, {} as Record<string, number>),
    types: apiData.types.map((t) => t.type.name),
    hp: maxHp,
    maxHp: maxHp,
    moves: getRandomMoves(apiData, 4), // agora são 4 aleatórios
  };
}
