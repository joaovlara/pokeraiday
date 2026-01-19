export interface RawPokemon {
  id: number;
  name: string;
  sprites: { front_default: string };
  stats: { base_stat: number; stat: { name: string } }[];
  moves?: { move: { name: string; url: string } }[];
  types?: { type: { name: string } }[];
}

export interface Combatant {
  id: number;
  name: string;
  sprite: string;
  level: number;
  iv: number;
  hpMax: number;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  moves: { name: string; url?: string; power?: number }[];
  isBoss?: boolean;
  raw?: RawPokemon;
}

export function getBaseStat(raw: RawPokemon, statName: string) {
  return raw.stats.find((s) => s.stat.name === statName)?.base_stat || 0;
}

export function calcHP(base: number, iv: number, ev: number, level: number) {
  return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
}

export function calcStat(base: number, iv: number, ev: number, level: number) {
  return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
}

export function buildCombatant(raw: RawPokemon, level: number, iv = 31, isBoss = false): Combatant {
  const hpBase = getBaseStat(raw, "hp");
  const atkBase = getBaseStat(raw, "attack");
  const defBase = getBaseStat(raw, "defense");
  const spdBase = getBaseStat(raw, "speed");

  const hpMax = calcHP(hpBase, iv, 0, level);
  const atk = calcStat(atkBase, iv, 0, level);
  const def = calcStat(defBase, iv, 0, level);
  const spd = calcStat(spdBase, iv, 0, level);

  // pega até 4 movimentos (se existirem) como referência; power será buscado quando usado
  const moves = (raw.moves || []).slice(0, 4).map((m) => ({ name: m.move.name, url: m.move.url }));

  const fallbackMoves = [{ name: "Tackle", power: 50 }, { name: "Quick Attack", power: 40 }];

  return {
    id: raw.id,
    name: raw.name,
    sprite: raw.sprites.front_default,
    level,
    iv,
    hpMax,
    hp: hpMax,
    atk,
    def,
    spd,
    moves: moves.length ? moves : fallbackMoves,
    isBoss,
    raw,
  };
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

export function calcDamage(attacker: Combatant, defender: Combatant, power = 50) {
  const level = attacker.level;
  const atk = attacker.atk;
  const def = Math.max(1, defender.def);
  const base = Math.floor(((((2 * level) / 5 + 2) * power * atk) / def) / 50) + 2;
  const rand = 0.85 + Math.random() * 0.15; // 0.85 - 1.0
  const damage = Math.max(1, Math.floor(base * rand));
  return damage;
}
