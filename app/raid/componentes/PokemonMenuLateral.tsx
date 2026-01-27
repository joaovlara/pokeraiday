"use client";

import { PokemonEntity } from "@/entities/pokemon";
import Image from "next/image";

interface PokemonMenuLateralProps {
  team: PokemonEntity[];                          // os 5 pokémons escolhidos
  activePokemon: PokemonEntity | null;            // quem está ativo agora
  setActivePokemon: (pokemon: PokemonEntity) => void; // função para trocar ativo
}

const statusColors: Record<string, string> = {
  active: "border-green-500",
  reserve: "border-yellow-500",
  fainted: "border-red-700 opacity-50",
};

export default function PokemonMenuLateral({
  team,
  activePokemon,
  setActivePokemon,
}: PokemonMenuLateralProps) {
  return (
    <aside className="w-24 flex flex-col items-center space-y-4">
      {team.map((pkm) => {
        const isSelected = activePokemon?.id === pkm.id;

        // status pode ser calculado dinamicamente (ex: hp === 0 => fainted)
        const status =
          pkm.hp <= 0 ? "fainted" : isSelected ? "active" : "reserve";

        return (
          <div
            key={pkm.id}
            onClick={() => setActivePokemon(pkm)}
            className={`flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 
              ${statusColors[status]} 
              ${isSelected ? "w-20 h-20 border-4" : "w-16 h-16 border-2"} 
            `}
          >
            {pkm.sprite && (
              <Image
                src={pkm.sprite}
                alt={pkm.name}
                width={isSelected ? 60 : 48}
                height={isSelected ? 60 : 48}
                className="transition-all duration-300"
              />
            )}
          </div>
        );
      })}
    </aside>
  );
}
