"use client";

import { useState } from "react";
import { PokemonEntity } from "@/entities/pokemon";
import { BossEntity } from "@/entities/boss";
import Image from "next/image";

interface Attack {
  nome: string;
  dano: number | string;
  usos: string;
  tipo: string;
}

interface PokemonStatsProps {
  pokemon: PokemonEntity;
  boss: BossEntity | null;
  onAttack: (attack: Attack, pokemon: PokemonEntity) => void; // nova prop
}

const PokemonStats = ({ pokemon, boss, onAttack }: PokemonStatsProps) => {
  const [selectedAttack, setSelectedAttack] = useState<number | null>(null);

  const attacks: Attack[] = [
    { nome: "Flame Charge", dano: 60, usos: "15/15", tipo: "/images/Fire_icon_SwSh.png" },
    { nome: "Brave Bird", dano: 120, usos: "10/10", tipo: "/images/Flying_icon_SwSh.png" },
    { nome: "Steel Wing", dano: 70, usos: "20/20", tipo: "/images/Steel_icon_SwSh.png" },
    { nome: "Roost", dano: "-", usos: "10/10", tipo: "/images/Flying_icon_SwSh.png" },
  ];

  return (
    <section className="flex flex-col w-full gap-5">
      {/* Infos do Pokemon */}
      <div className="border-card bg-neutral-900">
        <div className="flex justify-between p-3">
          <h3 className="name-pokemon capitalize">{pokemon.name}</h3>
          <p>Nível: {pokemon.level}</p>
        </div>
        <div className="flex justify-between p-3">
          <p className="text-sm">HP: {pokemon.hp}/{pokemon.hp}</p>
          <div className="w-32 h-3 bg-gray-700 rounded">
            <div
              className="h-3 bg-green-500 rounded"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* Ataques do Pokemon */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        {attacks.map((atk, i) => (
          <div
            key={i}
            onClick={() => {
              setSelectedAttack(i);
              onAttack(atk, pokemon); // dispara ação
            }}
            className={`flex items-center justify-between border-card bg-neutral-900 p-3 text-white cursor-pointer transition 
              ${selectedAttack === i ? "border-2 border-neutral-400" : "border"}`}
          >
            <div>
              <h3 className="name-pokemon text-sm">{atk.nome}</h3>
              <p className="text-sm text-gray-300">Dano: {atk.dano}</p>
              <p className="text-sm text-gray-400">{atk.usos}</p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src={atk.tipo}
                alt={`Tipo ${atk.nome}`}
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
