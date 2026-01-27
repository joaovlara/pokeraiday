"use client";

import { useState } from "react";

interface Attack {
  nome: string;
  dano: number | string; // pode ser número ou "-" como string
  usos: string;
  tipo: string;
}

const attacks: Attack[] = [
  { nome: "Flame Charge", dano: 60, usos: "15/15", tipo: "/images/Electric_icon_SwSh.png" },
  { nome: "Brave Bird", dano: 120, usos: "10/10", tipo: "/images/Electric_icon_SwSh.png" },
  { nome: "Steel Wing", dano: 70, usos: "20/20", tipo: "/images/Electric_icon_SwSh.png" },
  { nome: "Roost", dano: "-", usos: "10/10", tipo: "/images/Electric_icon_SwSh.png" },
];

const PokemonStats: React.FC = () => {
  const [selectedAttack, setSelectedAttack] = useState<number | null>(null);

  return (
    <section className="flex flex-col w-full gap-5">

      {/* Infos do Pokemon */}
      <div className="border-card bg-neutral-900">
        <div className="flex justify-between p-3">
          <h3 className="name-pokemon">Nome</h3>
          <p>Nivel: 100</p>
        </div>
        <div className="flex justify-between p-3">
          <p className="text-sm">HP: 100/100</p>
          <p>barra de vida</p>
        </div>
      </div>

      {/* Ataques do Pokemon */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        {attacks.map((atk, i) => (
          <div
            key={i}
            onClick={() => setSelectedAttack(i)}
            className={`flex items-center justify-between border-card bg-neutral-900 p-3 text-white cursor-pointer transition 
              ${selectedAttack === i ? "border-2 border-neutral-400" : "border"}`}
          >
            <div>
              <h3 className="name-pokemon text-sm">{atk.nome}</h3>
              <p className="text-sm text-gray-300">Dano: {atk.dano}</p>
              <p className="text-sm text-gray-400">{atk.usos}</p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src={atk.tipo}
                alt={`Tipo ${atk.nome}`}
                className="w-8 h-8"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PokemonStats;
