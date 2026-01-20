// app/page.tsx
"use client";
import { useRouter } from "next/navigation";
import BossDisplay from "@/app/components/BossDisplay";
import CandidateSelection from "@/app/components/CandidateSelection";
import { useRaidBoss } from "@/app/hooks/useRaidBoss";
import { useRaidCandidates } from "@/app/hooks/useRaidCandidates";
import { useRaidSelection } from "@/app/hooks/useRaidSelection";

export default function HomePage() {
  const router = useRouter();
  const { boss, loading: loadingBoss, error } = useRaidBoss();
  const { candidates, loading: loadingCandidates, generateCandidates } = useRaidCandidates();
  const { chosen, toggleChoose, resetSelection } = useRaidSelection();

  async function handleDesafiar() {
    if (!boss) return;
    resetSelection();
    await generateCandidates(8, 70);
  }

  function startRaid() {
    if (!boss || chosen.length !== 5) return;
    sessionStorage.setItem("raidBoss", JSON.stringify(boss));
    sessionStorage.setItem("raidTeam", JSON.stringify(chosen));
    router.push("/raid/battle");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Raid — Desafio</h1>

        <BossDisplay
          boss={boss}
          loading={loadingBoss}
          error={error}
          onChallenge={handleDesafiar}
          challengeLoading={loadingCandidates}
        />

        <CandidateSelection
          candidates={candidates}
          chosen={chosen}
          onToggleChoose={toggleChoose}
          onStartRaid={startRaid}
        />

        <div className="text-sm text-gray-400 mt-2">
          Dica: clique em{" "}
          <span className="font-medium text-slate-100">Desafiar</span> para
          sortear a equipe. Escolha 5 Pokémon e clique em{" "}
          <span className="font-medium text-slate-100">Iniciar Raid</span>.
        </div>
      </div>
    </div>
  );
}
