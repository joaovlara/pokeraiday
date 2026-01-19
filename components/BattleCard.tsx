import Image from "next/image";
import { Pokemon, Move } from "@/types/pokemon";
import { getStat, getHPBarColor } from "@/lib/utils";

interface BattleCardProps {
  pokemon: Pokemon;
  currentHp: number;
  moves: Move[];
  isP1: boolean;
  winner: string;
  onAttack: (move: Move) => void;
}

export function BattleCard({
  pokemon,
  currentHp,
  moves,
  isP1,
  winner,
  onAttack,
}: BattleCardProps) {
  const maxHp = getStat(pokemon, "hp");
  const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
  const barColor = getHPBarColor(hpPercent);

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 flex-1 flex flex-col items-center transition-transform hover:scale-[1.02]">
      <Image
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        width={140}
        height={140}
        className="drop-shadow-lg"
      />
      <h2 className="text-2xl font-bold capitalize mt-2">{pokemon.name}</h2>

      <div className="w-full mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-700">HP</span>
          <span className="font-medium">
            {currentHp} / {maxHp}
          </span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-4 ${barColor} rounded-full transition-all duration-500`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      <ul className="mt-4 text-left w-full space-y-1">
        {["attack", "defense", "speed"].map((stat) => (
          <li key={stat} className="capitalize flex justify-between text-sm text-gray-700">
            <span>{stat}</span>
            <span className="font-medium">{getStat(pokemon, stat)}</span>
          </li>
        ))}
      </ul>

      <div className="w-full mt-4">
        <div className="text-sm text-gray-600 mb-2">Golpes</div>
        <ul className="grid grid-cols-2 gap-2">
          {moves.map((m) => (
            <li key={m.name}>
              <button
                className="w-full bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm capitalize"
                onClick={() => onAttack(m)}
                disabled={!!winner || currentHp === 0}
              >
                {m.name.replace("-", " ")}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
