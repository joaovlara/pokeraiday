// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { generateBossRaw, generateCandidatesRaw } from "@/libs/raidGenerator";

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
    <div className="min-h-screen bg-gray-900 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Raid — Desafio</h1>

        {/* Boss centralizado */}
        <section className="flex flex-col items-center justify-center bg-gray-800/60 border border-gray-700 rounded-2xl p-8 mb-6 shadow-lg">
          {loadingBoss ? (
            <div className="text-lg text-gray-300">Sorteando boss...</div>
          ) : boss ? (
            <>
              <div className="w-40 h-40 flex items-center justify-center bg-gray-800 rounded-lg mb-4">
                {boss.sprites?.front_default ? (
                  <Image
                    src={boss.sprites.front_default}
                    alt={boss.name}
                    width={160}
                    height={160}
                    className="drop-shadow-lg"
                  />
                ) : (
                  <div className="text-sm text-gray-400">Sem sprite</div>
                )}
              </div>

              <div className="text-2xl font-semibold capitalize">
                {boss.name}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Nível 100 · IV 31
              </div>

              <div className="mt-6">
                <button
                  onClick={handleDesafiar}
                  className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-60"
                  disabled={loadingCandidates}
                >
                  {loadingCandidates ? "Sorteando equipe..." : "Desafiar"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-red-400">
              Erro ao sortear boss. Recarregue a página.
            </div>
          )}
        </section>

        {/* Candidatos (aparecem após Desafiar) */}
        {candidates.length > 0 && (
          <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Escolha 5 entre 8 candidatos
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {candidates.map((c, i) => {
                const isChosen = !!chosen.find(
                  (ch) => ch.raw.id === c.raw.id && ch.level === c.level,
                );
                return (
                  <div
                    key={`${c.raw.id}-${c.level}-${i}`}
                    className={`p-3 rounded-lg border ${isChosen ? "ring-2 ring-green-400 border-green-600" : "border-gray-700"} bg-gray-900`}
                  >
                    <div className="w-20 h-20 mx-auto">
                      {c.raw?.sprites?.front_default ? (
                        <Image
                          src={c.raw.sprites.front_default}
                          alt={c.raw.name}
                          width={80}
                          height={80}
                        />
                      ) : (
                        <div className="text-sm text-gray-400">Sem sprite</div>
                      )}
                    </div>
                    <div className="capitalize font-medium mt-2 text-center text-slate-100">
                      {c.raw.name}
                    </div>
                    <div className="text-sm text-gray-400 mt-1 text-center">
                      Lv {c.level}
                    </div>
                    <div className="mt-3 flex justify-center">
                      <button
                        onClick={() => toggleChoose(c)}
                        className={`px-3 py-1 rounded text-sm ${isChosen ? "bg-red-600 text-white hover:bg-red-700" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                      >
                        {isChosen ? "Remover" : "Escolher"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Selecionados:{" "}
                <span className="font-medium text-slate-100">
                  {chosen.length}
                </span>{" "}
                / 5
              </div>
              <div className="flex gap-3">
                <button
                  onClick={startRaid}
                  disabled={chosen.length !== 5}
                  className="px-5 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                >
                  Iniciar Raid
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Dica / instruções */}
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
