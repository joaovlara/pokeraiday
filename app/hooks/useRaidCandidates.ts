// app/hooks/useRaidCandidates.ts
import { useState } from "react";
import { RawPokemon } from "@/libs/pokemonUtils";
import { generateCandidatesRaw } from "@/libs/services/pokemonApi";

export type Candidate = { raw: RawPokemon; level: number };

export function useRaidCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateCandidates(count = 8, maxLevel = 70) {
    setLoading(true);
    setCandidates([]);
    setError(null);
    try {
      const cands = await generateCandidatesRaw(count, maxLevel);
      setCandidates(cands);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar candidatos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return { candidates, loading, error, generateCandidates };
}
