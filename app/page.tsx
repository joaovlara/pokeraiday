"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateBossRaw, generateCandidatesRaw } from "@/libs/raidGenerator";
import { BossSection } from "./components/BossSection";
import { CandidatesSection } from "./components/CandidatesSection";
import { RaidTip } from "./components/RaidTip";

type Candidate = { raw: any; level: number };

export default function HomePage() {
  const [boss, setBoss] = useState<any | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [chosen, setChosen] = useState<Candidate[]>([]);
  const [loadingBoss, setLoadingBoss] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const router = useRouter();

  // Sorteia o boss automaticamente ao carregar a página
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingBoss(true);
      try {
        const bossRaw = await generateBossRaw();
        if (!mounted) return;
        setBoss(bossRaw);
        setCandidates([]);
        setChosen([]);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoadingBoss(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Ao clicar em "Desafiar" sorteia os 8 candidatos
  async function handleDesafiar() {
    if (!boss) return;
    setLoadingCandidates(true);
    setCandidates([]);
    setChosen([]);
    try {
      const cands = await generateCandidatesRaw(8, 70);
      setCandidates(cands);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCandidates(false);
    }
  }

  function toggleChoose(item: Candidate) {
    const exists = chosen.find(
      (c) => c.raw.id === item.raw.id && c.level === item.level,
    );
    if (exists) {
      setChosen((s) =>
        s.filter((c) => !(c.raw.id === item.raw.id && c.level === item.level)),
      );
    } else if (chosen.length < 5) {
      setChosen((s) => [...s, item]);
    }
  }

  function startRaid() {
    if (!boss || chosen.length !== 5) return;
    sessionStorage.setItem("raidBoss", JSON.stringify(boss));
    sessionStorage.setItem("raidTeam", JSON.stringify(chosen));
    router.push("/raid/battle");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        <BossSection
          boss={boss}
          loadingBoss={loadingBoss}
          loadingCandidates={loadingCandidates}
          onDesafiar={handleDesafiar}
        />

        {candidates.length > 0 && (
          <>
            <CandidatesSection
              candidates={candidates}
              chosen={chosen}
              onToggleChoose={toggleChoose}
              onStartRaid={startRaid}
            />
          </>
        )}

        <RaidTip />
      </div>
    </div>
  );
}
