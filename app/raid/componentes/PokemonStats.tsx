"use client";

import { useState } from "react";
import { PokemonEntity } from "@/entities/pokemon.entity";
import { BossEntity } from "@/entities/boss.entity";
import Image from "next/image";
import { typeMap } from "@/utils/typeMap";
import { useBattle } from "@/context/battle.context";

interface PokemonStatsProps {
  pokemon: PokemonEntity;
  boss: BossEntity | null;
  onAttack: (attack: any, pokemon: PokemonEntity) => void;
}

const PokemonStats = ({ pokemon, boss, onAttack }: PokemonStatsProps) => {
  const [selectedAttack, setSelectedAttack] = useState<number | null>(null);
  const { hasPokemonAttacked } = useBattle();

  const disabled = hasPokemonAttacked(pokemon.id);

  return (
    <section className="flex flex-col w-full gap-5">
      {/* Infos do Pokemon */}
      <div className="border-card bg-neutral-900">
        <div className="flex justify-between p-3">
          <h3 className="name-pokemon capitalize">{pokemon.name}</h3>
          <p>Nível: {pokemon.level}</p>
        </div>
        <div className="flex justify-between p-3">
          <p className="text-sm">
            HP: {pokemon.hp}/{pokemon.maxHp}
          </p>
          <div className="w-32 h-3 bg-gray-700 rounded">
            <div
              className="h-3 bg-green-500 rounded"
              style={{ width: `${(pokemon.hp / pokemon.maxHp) * 100}%` }}
            />
          </div>
        </div>
        {disabled && (
          <div className="p-2 text-sm text-yellow-300">Este pokémon já atacou.</div>
        )}
      </div>

      {/* Ataques do Pokemon */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        {pokemon.moves.slice(0, 4).map((atk, i) => (
          <div
            key={i}
            onClick={() => {
              if (disabled) return;
              setSelectedAttack(i);
              onAttack(atk, pokemon);
            }}
            className={`flex items-center justify-between border-card bg-neutral-900 p-3 text-white cursor-pointer transition 
              ${selectedAttack === i ? "border-2 border-neutral-400" : "border"}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-disabled={disabled}
          >
            <div>
              <h3 className="name-pokemon text-sm">{atk.name}</h3>
              <p className="text-sm text-gray-300">Power: {atk.power ?? "-"}</p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src={typeMap[atk.type].icon}
                alt={`Tipo ${atk.type}`}
                width={32}
                height={32}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PokemonStats;
