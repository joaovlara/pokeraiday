"use client"

import { useState } from "react";
import Image from "next/image";

export default function PokemonMenuLateral() {
  const [selected, setSelected] = useState<number | null>(null);

  const team = [
    { nome: "Talonflame", status: "active", sprite: "/images/sprite.png" },
    { nome: "Pancham", status: "fainted", sprite: "/images/sprite.png" },
    { nome: "sprite", status: "fainted", sprite: "/images/sprite.png" },
    { nome: "sprite", status: "reserve", sprite: "/images/sprite.png" },
    { nome: "sprite", status: "active", sprite: "/images/sprite.png" },
  ];

  const statusColors: Record<string, string> = {
    active: "border-green-500",
    reserve: "border-yellow-500",
    fainted: "border-red-700 opacity-50",
  };

  return (
    <aside className="w-24 flex flex-col items-center space-y-4">
      {team.map((pkm, i) => {
        const isSelected = selected === i;
        return (
          <div
            key={i}
            onClick={() => setSelected(i)}
            className={`flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 
              ${statusColors[pkm.status]} 
              ${isSelected ? "w-20 h-20 border-4" : "w-16 h-16 border-2"} 
            `}
          >
            <Image
              src={pkm.sprite}
              alt={pkm.nome}
              width={isSelected ? 60 : 48}
              height={isSelected ? 60 : 48}
              className="transition-all duration-300"
            />
          </div>
        );
      })}
    </aside>
  );
}
