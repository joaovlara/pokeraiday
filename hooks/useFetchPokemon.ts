import { useState } from "react";
import { Pokemon } from "@/types/pokemon";
import { fetchPokemon } from "@/lib/api";

interface UseFetchPokemonReturn {
  pokemon: Pokemon | null;
  loading: boolean;
  error: string;
  fetchByName: (name: string) => Promise<void>;
  clearPokemon: () => void;
}

export function useFetchPokemon(): UseFetchPokemonReturn {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchByName = async (name: string) => {
    if (!name.trim()) return;

    setError("");
    setPokemon(null);
    setLoading(true);

    try {
      const data = await fetchPokemon(name);
      setPokemon(data);
    } catch (e: any) {
      setError(e.message || "Erro ao buscar Pokémon");
    } finally {
      setLoading(false);
    }
  };

  const clearPokemon = () => {
    setPokemon(null);
    setError("");
  };

  return { pokemon, loading, error, fetchByName, clearPokemon };
}
