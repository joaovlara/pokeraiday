import React from "react";

const attacks = [
  { nome: "Flame Charge", dano: 60, usos: "15/15", tipo: "/icons/fire.png" },
  { nome: "Brave Bird", dano: 120, usos: "10/10", tipo: "/icons/flying.png" },
  { nome: "Steel Wing", dano: 70, usos: "20/20", tipo: "/icons/steel.png" },
  { nome: "Roost", dano: "-", usos: "10/10", tipo: "/icons/normal.png" },
];

const PokemonStats = () => {
  return (
    <section className="flex flex-col w-full gap-5">
      <div className="border-card">
        <div className="flex justify-between p-3">
          <h3>Nome</h3>
          <p>nivel</p>
        </div>
        <div className="flex justify-between p-3">
          <p className="text-sm">HP: 100/100</p>
          <p>barra de vida</p>
        </div>
      </div>

      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        {attacks.map((atk, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-card p-3 text-white"
          >
            <div>
              <h3 className="font-bold">{atk.nome}</h3>
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
