"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useBattle } from "@/hooks/useBattle";
import { BattleScreen } from "@/components/BattleScreen";

export default function Battle() {
  const searchParams = useSearchParams();
  const p1Name = searchParams.get("p1") || "";
  const p2Name = searchParams.get("p2") || "";

  const { p1, p2, hp1, hp2, winner, loading, attack, resetBattle } = useBattle(
    p1Name,
    p2Name
  );

  if (loading || !p1 || !p2 || hp1 === null || hp2 === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Carregando...
      </div>
    );
  }

  return (
    <>
      <BattleScreen
        p1={p1}
        p2={p2}
        hp1={hp1}
        hp2={hp2}
        winner={winner}
        onAttack={attack}
        onReset={resetBattle}
      />
      <div className="fixed bottom-4 left-4">
        <Link
          href="/"
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Voltar
        </Link>
      </div>
    </>
  );
}
