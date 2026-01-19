import { Pokemon, Move } from "@/types/pokemon";
import { BattleCard } from "./BattleCard";

interface BattleArenaProps {
  p1: Pokemon;
  p2: Pokemon;
  hp1: number;
  hp2: number;
  moves1: Move[];
  moves2: Move[];
  winner: string;
  lastAction: string;
  onAttack: (isP1: boolean, move: Move) => void;
}

export function BattleArena({
  p1,
  p2,
  hp1,
  hp2,
  moves1,
  moves2,
  winner,
  lastAction,
  onAttack,
}: BattleArenaProps) {
  return (
    <div className="w-full max-w-4xl bg-white/70 backdrop-blur rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between gap-6">
        <BattleCard
          pokemon={p1}
          currentHp={hp1}
          moves={moves1}
          isP1={true}
          winner={winner}
          onAttack={(move) => onAttack(true, move)}
        />

        <BattleCard
          pokemon={p2}
          currentHp={hp2}
          moves={moves2}
          isP1={false}
          winner={winner}
          onAttack={(move) => onAttack(false, move)}
        />
      </div>

      <div className="mt-6">
        {lastAction && <div className="text-gray-800 italic">{lastAction}</div>}
        {winner && (
          <div className="mt-4 text-2xl font-bold text-green-700">
            🎉 {winner} venceu a batalha!
          </div>
        )}
      </div>
    </div>
  );
}
