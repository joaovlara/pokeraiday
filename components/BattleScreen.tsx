"use client";
import Image from "next/image";
import { Pokemon } from "@/types/pokemon";
import { getStat, getStatPercentage, getTypeColor } from "@/lib/battle";

interface BattleScreenProps {
  p1: Pokemon;
  p2: Pokemon;
  hp1: number;
  hp2: number;
  winner: string;
  onAttack: (attackerIndex: 0 | 1) => void;
  onReset: () => void;
  loading?: boolean;
}

export function BattleScreen({
  p1,
  p2,
  hp1,
  hp2,
  winner,
  onAttack,
  onReset,
  loading = false,
}: BattleScreenProps) {
  const maxHp1 = getStat(p1, "hp");
  const maxHp2 = getStat(p2, "hp");
  const hp1Percentage = getStatPercentage(hp1, maxHp1);
  const hp2Percentage = getStatPercentage(hp2, maxHp2);

  const renderPokemonBattle = (pokemon: Pokemon, hp: number, index: 0 | 1) => {
    const maxHp = getStat(pokemon, "hp");
    const percentage = getStatPercentage(hp, maxHp);

    return (
      <div key={pokemon.name} className="bg-white rounded shadow p-6 flex flex-col items-center w-64">
        <Image
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          width={96}
          height={96}
          className="drop-shadow"
        />
        <h2 className="text-xl font-semibold capitalize mt-2">
          {pokemon.name}
        </h2>
        <div className="w-full mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>HP</span>
            <span>
              {hp} / {maxHp}
            </span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded">
            <div
              className={`h-4 ${getTypeColor(hp, maxHp)} rounded transition-all duration-300`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <ul className="mt-4 text-left w-full text-sm">
          {["attack", "defense", "speed"].map((stat) => (
            <li key={stat} className="capitalize flex justify-between">
              <span>{stat}:</span>
              <span>{getStat(pokemon, stat)}</span>
            </li>
          ))}
        </ul>
        <button
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={() => onAttack(index)}
          disabled={
            winner !== "" || hp === 0 || (index === 0 ? hp2 === 0 : hp1 === 0)
          }
        >
          Atacar
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-yellow-100 to-red-200 p-4">
      <h1 className="text-3xl font-bold mb-8">Batalha Pokémon</h1>
      <div className="flex gap-12 mb-8">
        {renderPokemonBattle(p1, hp1, 0)}
        {renderPokemonBattle(p2, hp2, 1)}
      </div>
      {winner && (
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700 mb-4">
            {winner} venceu a batalha!
          </div>
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            onClick={onReset}
          >
            Nova Batalha
          </button>
        </div>
      )}
    </div>
  );
}
