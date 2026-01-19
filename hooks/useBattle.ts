import { useEffect, useState } from "react";
import { Pokemon } from "@/types/pokemon";
import { fetchMultiplePokemon } from "@/lib/api";
import { getStat, calculateDamage, performAttack } from "@/lib/battle";

interface UseBattleReturn {
  p1: Pokemon | null;
  p2: Pokemon | null;
  hp1: number | null;
  hp2: number | null;
  winner: string;
  loading: boolean;
  attack: (attackerIndex: 0 | 1) => void;
  resetBattle: () => void;
}

export function useBattle(
  p1Name: string,
  p2Name: string
): UseBattleReturn {
  const [p1, setP1] = useState<Pokemon | null>(null);
  const [p2, setP2] = useState<Pokemon | null>(null);
  const [hp1, setHp1] = useState<number | null>(null);
  const [hp2, setHp2] = useState<number | null>(null);
  const [winner, setWinner] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBattle() {
      setLoading(true);
      try {
        const [pokemon1, pokemon2] = await fetchMultiplePokemon([
          p1Name,
          p2Name,
        ]);
        setP1(pokemon1);
        setP2(pokemon2);
        setHp1(getStat(pokemon1, "hp"));
        setHp2(getStat(pokemon2, "hp"));
        setWinner("");
      } catch (error) {
        console.error("Erro ao carregar batalha:", error);
      } finally {
        setLoading(false);
      }
    }

    if (p1Name && p2Name) {
      loadBattle();
    }
  }, [p1Name, p2Name]);

  const attack = (attackerIndex: 0 | 1) => {
    if (winner || !p1 || !p2 || hp1 === null || hp2 === null) return;

    const attacker = attackerIndex === 0 ? p1 : p2;
    const defender = attackerIndex === 0 ? p2 : p1;
    const currentDefenderHp = attackerIndex === 0 ? hp2 : hp1;

    const damage = calculateDamage(attacker, defender);
    const { newHp, isDefeated } = performAttack(currentDefenderHp, damage);

    if (attackerIndex === 0) {
      setHp2(newHp);
      if (isDefeated) setWinner(attacker.name);
    } else {
      setHp1(newHp);
      if (isDefeated) setWinner(attacker.name);
    }
  };

  const resetBattle = () => {
    setWinner("");
    if (p1) setHp1(getStat(p1, "hp"));
    if (p2) setHp2(getStat(p2, "hp"));
  };

  return { p1, p2, hp1, hp2, winner, loading, attack, resetBattle };
}
