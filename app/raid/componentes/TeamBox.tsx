"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PokemonEntity } from "@/entities/pokemon.entity";
import { useBattle } from "@/context/battle.context";

interface TeamBoxProps {
  attackers: PokemonEntity[];
  team: PokemonEntity[];
  setTeam?: React.Dispatch<React.SetStateAction<PokemonEntity[]>>; // agora opcional
  onStartBattle: () => void;
}

const TeamBox = ({ attackers, team, setTeam, onStartBattle }: TeamBoxProps) => {
  const { setTeam: setTeamFromContext } = useBattle(); // fallback para contexto
  const setter = setTeam ?? setTeamFromContext;

  // estado local para controlar seleção imediatamente na UI
  const [selected, setSelected] = useState<PokemonEntity[]>(team ?? []);

  // sincroniza seleção local quando `team` externo mudar
  useEffect(() => {
    setSelected(team ?? []);
  }, [team]);

  // atualiza tanto o estado local quanto o setter (contexto ou prop) quando necessário
  const updateSelection = (next: PokemonEntity[]) => {
    setSelected(next);
    if (setter) setter(next);
  };

  const toggleSelect = (pokemon: PokemonEntity) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p.id === pokemon.id);
      let next: PokemonEntity[];
      if (exists) {
        next = prev.filter((p) => p.id !== pokemon.id);
      } else {
        if (prev.length >= 5) {
          // não adiciona se já tem 5
          return prev;
        }
        next = [...prev, pokemon];
      }
      // propaga para setter (contexto ou prop) de forma síncrona
      if (setter) setter(next);
      return next;
    });
  };

  const handleStart = () => {
    // garante que só inicia com exatamente 5 selecionados
    if (selected.length !== 5) return;
    // garante que o setter do contexto/prop recebeu a seleção final
    if (setter) setter(selected);
    onStartBattle();
  };

  return (
    <div className="w-full">
      <div className="p-3">
        <h2 className="text-emphasis">Escolha sua Equipe: {selected.length}/5</h2>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-3 gap-4">
        {attackers.map((pokemon) => {
          const isSelected = selected.some((p) => p.id === pokemon.id);
          return (
            <div
              key={pokemon.id}
              onClick={() => toggleSelect(pokemon)}
              className={`flex flex-col items-center justify-center bg-neutral-900 border-2 aspect-square rounded-lg p-4 cursor-pointer transition-colors ${
                isSelected ? "border-green-500 bg-neutral-950" : "border-stone-700"
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
        disabled={selected.length !== 5}
        onClick={handleStart}
        className="flex items-center justify-center bg-red-900 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold rounded-lg p-2 text-center mt-4"
      >
        Iniciar Batalha
      </button>
    </div>
  );
};

export default TeamBox;
