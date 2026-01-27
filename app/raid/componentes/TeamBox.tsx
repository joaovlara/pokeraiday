"use client";

import Image from "next/image";
import { PokemonEntity } from "@/entities/pokemon";

interface TeamBoxProps {
  attackers: PokemonEntity[];
  team: PokemonEntity[];
  setTeam: React.Dispatch<React.SetStateAction<PokemonEntity[]>>; // <- opção 1
  onStartBattle: () => void;
}

const TeamBox = ({ attackers, team, setTeam, onStartBattle }: TeamBoxProps) => {
  const toggleSelect = (pokemon: PokemonEntity) => {
    setTeam((prev) => {
      if (prev.find((p) => p.id === pokemon.id)) {
        return prev.filter((p) => p.id !== pokemon.id);
      }
      if (prev.length < 5) {
        return [...prev, pokemon];
      }
      return prev; // não deixa passar de 5
    });
  };

  return (
    <div className="w-full">
      <div className="p-3">
        <h2 className="text-emphasis">Escolha sua Equipe: {team.length}/5</h2>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-3 gap-4">
        {attackers.map((pokemon) => {
          const isSelected = team.some((p) => p.id === pokemon.id);
          return (
            <div
              key={pokemon.id}
              onClick={() => toggleSelect(pokemon)}
              className={`flex flex-col items-center justify-center bg-neutral-900 border-2 aspect-square rounded-lg p-4 cursor-pointer transition-colors ${
                isSelected
                  ? "border-green-500 bg-neutral-950"
                  : "border-stone-700"
              }`}
            >
              {pokemon.sprite && (
                <Image
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="mb-2"
                  height={50}
                  width={50}
                />
              )}
              <span className="name-pokemon capitalize">{pokemon.name}</span>
              <p>Nível: {pokemon.level}</p>
            </div>
          );
        })}
      </div>

      {/* Botão de iniciar batalha */}
      <button
        disabled={team.length !== 5}
        onClick={onStartBattle}
        className="flex items-center justify-center bg-red-900 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold rounded-lg p-2 text-center mt-4"
      >
        Iniciar Batalha
      </button>
    </div>
  );
};

export default TeamBox;
