import { useState, useCallback } from "react";
import { Pokemon } from "@/types/pokemon";

interface UseHomeState {
  search: string;
  pokemon: Pokemon | null;
  chosen: Pokemon[];
  error: string;
  setSearch: (search: string) => void;
  setPokemon: (pokemon: Pokemon | null) => void;
  setChosen: (pokemon: Pokemon[]) => void;
  setError: (error: string) => void;
  addChosenPokemon: (pokemon: Pokemon) => void;
  removeChosenPokemon: (name: string) => void;
  clearSearch: () => void;
}

export function useHomeState(): UseHomeState {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [chosen, setChosen] = useState<Pokemon[]>([]);
  const [error, setError] = useState("");

  const addChosenPokemon = useCallback(
    (poke: Pokemon) => {
      if (chosen.length < 2 && !chosen.find((p) => p.name === poke.name)) {
        setChosen([...chosen, poke]);
      }
    },
    [chosen],
  );

  const removeChosenPokemon = useCallback((name: string) => {
    setChosen((prev) => prev.filter((p) => p.name !== name));
  }, []);

  const clearSearch = useCallback(() => {
    setSearch("");
    setPokemon(null);
    setError("");
  }, []);

  return {
    search,
    pokemon,
    chosen,
    error,
    setSearch,
    setPokemon,
    setChosen,
    setError,
    addChosenPokemon,
    removeChosenPokemon,
    clearSearch,
  };
}
