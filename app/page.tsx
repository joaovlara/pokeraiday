"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pokemon } from "@/types/pokemon";
import { fetchPokemon } from "@/lib/pokemonService";
import { useHomeState } from "@/hooks/useHomeState";
import { SearchBar } from "@/components/SearchBar";
import { PokemonCard } from "@/components/PokemonCard";

export default function Home() {
  const router = useRouter();
  const { search, pokemon, chosen, error, setSearch, setPokemon, setError, addChosenPokemon, removeChosenPokemon } = useHomeState();
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setError("");
    setPokemon(null);
    setLoading(true);

    try {
      const data = await fetchPokemon(search);
      if (!data) throw new Error("Pokémon não encontrado");
      setPokemon(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPokemon = (poke: Pokemon) => {
    addChosenPokemon(poke);
    setSearch("");
    setPokemon(null);
  };

  const handleStartBattle = () => {
    if (chosen.length === 2) {
      router.push(`/battle?p1=${chosen[0].name}&p2=${chosen[1].name}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-100 via-indigo-200 to-purple-300 p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-700">
        Pokémon Battle Simulator
      </h1>

      <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} loading={loading} />

      {error && <div className="text-red-500 mb-4 font-medium">{error}</div>}

      {pokemon && (
        <PokemonCard
          pokemon={pokemon}
          isSelected={true}
          isChosen={chosen.some((p) => p.name === pokemon.name)}
          onSelect={handleSelectPokemon}
        />
      )}

      {chosen.length > 0 && (
        <div className="mt-8 w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">Pokémon Escolhidos</h2>
          <div className="flex gap-4 mb-6">
            {chosen.map((p) => (
              <PokemonCard
                key={p.name}
                pokemon={p}
                isSelected={false}
                isChosen={true}
                onSelect={() => {}}
                onRemove={removeChosenPokemon}
                compact={true}
              />
            ))}
          </div>
        </div>
      )}

      {chosen.length === 2 && (
        <button
          className="bg-red-500 text-white px-8 py-3 rounded text-lg hover:bg-red-600 transition-all transform hover:scale-105 font-bold shadow-lg"
          onClick={handleStartBattle}
        >
          🔥 Iniciar Batalha
        </button>
      )}
    </div>
  );
}
