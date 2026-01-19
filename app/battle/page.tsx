"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useBattle } from "@/hooks/useBattle";
import { fetchBothPokemon, fetchMovePower } from "@/lib/pokemonService";
import { pickRandomMoves, getStat, calculateDamage } from "@/lib/utils";
import { BattleArena } from "@/components/BattleArena";
import { Move } from "@/types/pokemon";

export default function BattlePage() {
  const searchParams = useSearchParams();
  const p1Name = searchParams.get("p1") || "";
  const p2Name = searchParams.get("p2") || "";

  const battle = useBattle();

  // Carregar dados dos pokémon
  useEffect(() => {
    async function loadBattle() {
      battle.setLoading(true);
      const [p1Data, p2Data] = await fetchBothPokemon(p1Name, p2Name);

      if (!p1Data || !p2Data) {
        battle.setLoading(false);
        return;
      }

      battle.setP1(p1Data);
      battle.setP2(p2Data);
      battle.setHp1(getStat(p1Data, "hp"));
      battle.setHp2(getStat(p2Data, "hp"));
      battle.setMoves1(pickRandomMoves(p1Data));
      battle.setMoves2(pickRandomMoves(p2Data));
      battle.setLoading(false);
    }

    if (p1Name && p2Name) loadBattle();
  }, [p1Name, p2Name, battle]);

  // Executar ataque
  const handleAttack = async (isP1: boolean, move: Move) => {
    if (!battle.p1 || !battle.p2 || battle.winner) return;

    const attacker = isP1 ? battle.p1 : battle.p2;
    const defender = isP1 ? battle.p2 : battle.p1;

    const power = await fetchMovePower(move.url);
    const basePower = power || 50;
    const damage = calculateDamage(basePower, getStat(attacker, "attack"), getStat(defender, "defense"));

    const defenderHp = isP1 ? battle.hp2! : battle.hp1!;
    const newHp = Math.max(0, defenderHp - damage);

    if (isP1) {
      battle.setHp2(newHp);
    } else {
      battle.setHp1(newHp);
    }

    battle.setLastAction(`${attacker.name} usou ${move.name} e causou ${damage} de dano!`);

    if (newHp === 0) {
      battle.setWinner(attacker.name);
    }
  };

  if (battle.loading || !battle.p1 || !battle.p2 || battle.hp1 === null || battle.hp2 === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl bg-linear-to-br from-yellow-100 via-orange-150 to-red-200">
        Carregando batalha...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-linear-to-br from-yellow-100 via-orange-150 to-red-200 p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Batalha Pokémon</h1>
      <BattleArena
        p1={battle.p1}
        p2={battle.p2}
        hp1={battle.hp1}
        hp2={battle.hp2}
        moves1={battle.moves1}
        moves2={battle.moves2}
        winner={battle.winner}
        lastAction={battle.lastAction}
        onAttack={handleAttack}
      />
    </div>
  );
}
