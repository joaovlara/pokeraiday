// app/raid/setup/page.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { generateBossRaw, generateCandidatesRaw } from "@/libs/raidGenerator";

type Candidate = { raw: any; level: number };

export default function RaidSetupPage() {
  const [boss, setBoss] = useState<any | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [chosen, setChosen] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const bossRaw = await generateBossRaw();
        const cands = await generateCandidatesRaw(8, 70);
        setBoss(bossRaw);
        setCandidates(cands);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  function toggleChoose(item: Candidate) {
    const exists = chosen.find((c) => c.raw.id === item.raw.id && c.level === item.level);
    if (exists) {
      setChosen((s) => s.filter((c) => !(c.raw.id === item.raw.id && c.level === item.level)));
    } else if (chosen.length < 5) {
      setChosen((s) => [...s, item]);
    }
  }

  function startRaid() {
    if (!boss || chosen.length !== 5) return;
    // salvar no sessionStorage para a página de batalha recuperar
    sessionStorage.setItem("raidBoss", JSON.stringify(boss));
    sessionStorage.setItem("raidTeam", JSON.stringify(chosen));
    router.push("/raid/battle");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Gerando raid...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Raid Setup</h1>

        <section className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">Boss (Nível 100)</h2>
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 flex items-center justify-center bg-gray-50 rounded-lg">
              {boss?.sprites?.front_default ? (
                <Image src={boss.sprites.front_default} alt={boss.name} width={96} height={96} />
              ) : (
                <div className="text-sm text-gray-500">No sprite</div>
              )}
            </div>
            <div>
              <div className="capitalize text-2xl font-bold">{boss.name}</div>
              <div className="text-sm text-gray-600 mt-1">Level 100 · IV 31</div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">Escolha 5 entre 8 candidatos</h2>
          <div className="grid grid-cols-4 gap-4">
            {candidates.map((c, i) => {
              const isChosen = !!chosen.find((ch) => ch.raw.id === c.raw.id && ch.level === c.level);
              return (
                <div
                  key={`${c.raw.id}-${c.level}-${i}`}
                  className={`p-3 rounded-lg border ${isChosen ? "ring-2 ring-green-400 border-green-200" : "border-gray-200"} bg-white flex flex-col items-center`}
                >
                  <div className="w-20 h-20 flex items-center justify-center">
                    {c.raw?.sprites?.front_default ? (
                      <Image src={c.raw.sprites.front_default} alt={c.raw.name} width={80} height={80} />
                    ) : (
                      <div className="text-sm text-gray-500">No sprite</div>
                    )}
                  </div>
                  <div className="capitalize font-medium mt-2 text-center">{c.raw.name}</div>
                  <div className="text-sm text-gray-600 mt-1">Lv {c.level}</div>
                  <button
                    onClick={() => toggleChoose(c)}
                    className={`mt-3 px-3 py-1 rounded text-sm ${isChosen ? "bg-red-500 text-white hover:bg-red-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                  >
                    {isChosen ? "Remover" : "Escolher"}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-sm text-gray-600">Selecionados: {chosen.length} / 5</div>
        </section>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              // regenerar candidatos e boss
              setLoading(true);
              setCandidates([]);
              setChosen([]);
              setBoss(null);
              // re-run init
              (async () => {
                try {
                  const bossRaw = await generateBossRaw();
                  const cands = await generateCandidatesRaw(8, 70);
                  setBoss(bossRaw);
                  setCandidates(cands);
                } catch (err) {
                  console.error(err);
                } finally {
                  setLoading(false);
                }
              })();
            }}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Regenerar
          </button>

          <button
            onClick={startRaid}
            disabled={chosen.length !== 5}
            className="px-6 py-2 rounded bg-red-600 text-white disabled:opacity-50"
          >
            Iniciar Raid
          </button>
        </div>
      </div>
    </div>
  );
}
