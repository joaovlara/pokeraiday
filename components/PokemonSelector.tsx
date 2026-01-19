"use client";
import { useState } from "react";
import { Pokemon } from "@/types/pokemon";
import { useFetchPokemon } from "@/hooks/useFetchPokemon";
import { PokemonCard } from "./PokemonCard";

interface PokemonSelectorProps {
  onSelectionComplete: (selected: Pokemon[]) => void;
  maxSelections?: number;
}

export function PokemonSelector({
  onSelectionComplete,
  maxSelections = 2,
}: PokemonSelectorProps) {
  const [search, setSearch] = useState("");
  const [chosen, setChosen] = useState<Pokemon[]>([]);
  const { pokemon, loading, error, fetchByName, clearPokemon } =
    useFetchPokemon();

  const selectPokemon = () => {
    if (
      pokemon &&
      chosen.length < maxSelections &&
      !chosen.find((p) => p.name === pokemon.name)
    ) {
      setChosen([...chosen, pokemon]);
      clearPokemon();
      setSearch("");
    }
  };

  const removeChosen = (name: string) => {
    setChosen(chosen.filter((p) => p.name !== name));
  };

  const handleSubmit = () => {
    if (chosen.length === maxSelections) {
      onSelectionComplete(chosen);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white/60 backdrop-blur rounded-2xl p-6 shadow-lg">
      <div className="flex gap-3">
        <input
          className="flex-1 border rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="Digite o nome do Pokémon (ex: pikachu)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchByName(search);
          }}
        />
        <button
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          onClick={() => fetchByName(search)}
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {error && <div className="text-red-600 mt-3">{error}</div>}

      {pokemon && (
        <PokemonCard
          pokemon={pokemon}
          onSelect={selectPokemon}
          isDisabled={
            chosen.length >= maxSelections ||
            !!chosen.find((p) => p.name === pokemon.name)
          }
          variant="detailed"
        />
      )}

      <div className="mt-6">
        <h3 className="text-sm text-gray-600 mb-2">
          Escolhidos ({chosen.length}/{maxSelections})
        </h3>
        <div className="flex gap-4">
          {chosen.length === 0 && (
            <div className="text-gray-500">Nenhum Pokémon selecionado</div>
          )}
          {chosen.map((p) => (
            <PokemonCard
              key={p.name}
              pokemon={p}
              onRemove={() => removeChosen(p.name)}
              variant="compact"
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-red-600 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={chosen.length !== maxSelections}
        >
          Iniciar Batalha
        </button>
      </div>
    </div>
  );
}
