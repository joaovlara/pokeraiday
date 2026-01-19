export interface Pokemon {
  name: string;
  sprites: { front_default: string };
  stats: { base_stat: number; stat: { name: string } }[];
  moves: { move: { name: string; url: string } }[];
}

export interface Move {
  name: string;
  url: string;
}

export interface BattleState {
  p1: Pokemon | null;
  p2: Pokemon | null;
  hp1: number | null;
  hp2: number | null;
  moves1: Move[];
  moves2: Move[];
  winner: string;
  loading: boolean;
  lastAction: string;
}

export interface BattleActions {
  setP1: (pokemon: Pokemon) => void;
  setP2: (pokemon: Pokemon) => void;
  setHp1: (hp: number) => void;
  setHp2: (hp: number) => void;
  setMoves1: (moves: Move[]) => void;
  setMoves2: (moves: Move[]) => void;
  setWinner: (winner: string) => void;
  setLoading: (loading: boolean) => void;
  setLastAction: (action: string) => void;
  resetBattle: () => void;
}
