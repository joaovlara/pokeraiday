// app/hooks/useRaidBoss.ts
import { useEffect, useState } from "react";
import { RawPokemon } from "@/libs/pokemonUtils";
import { generateBossRaw } from "@/libs/services/pokemonApi";

export function useRaidBoss() {
  const [boss, setBoss] = useState<RawPokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const bossRaw = await generateBossRaw();
        if (mounted) {
          setBoss(bossRaw);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Erro ao gerar boss");
          console.error(err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { boss, loading, error };
}
