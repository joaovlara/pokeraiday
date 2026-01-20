// app/raid/battle/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BossCombatDisplay from "@/app/components/BossCombatDisplay";
import BattleCombatant from "@/app/components/BattleCombatant";
import MoveSelector from "@/app/components/MoveSelector";
import BattleLog from "@/app/components/BattleLog";
import { useRaidBattle } from "@/app/hooks/useRaidBattle";

export default function RaidBattlePage() {
  const router = useRouter();
  const {
    boss,
    team,
    log,
    round,
    finished,
    winner,
    loading,
    executePlayerAttack,
    executeBossAttack,
    isBossDead,
  } = useRaidBattle();

  const [selectedAllyIndex, setSelectedAllyIndex] = useState<number | null>(null);
  const [selectedMoveIndex, setSelectedMoveIndex] = useState<number | null>(null);

  async function handlePlayerAttack() {
    if (selectedAllyIndex === null || selectedMoveIndex === null || !boss || !team[selectedAllyIndex]) {
      return;
    }

    const success = executePlayerAttack(selectedAllyIndex, selectedMoveIndex);
    if (!success) return;

    setSelectedAllyIndex(null);
    setSelectedMoveIndex(null);

    // Verificar vitória
    if (isBossDead()) return;

    // Esperar um pouco antes de fazer o ataque do boss
    setTimeout(() => {
      const aliveTeam = team.filter((t) => t.hp > 0 && !t.hasAttackedThisRound);
      if (aliveTeam.length === 0) {
        executeBossAttack();
      }
    }, 500);
  }

  function resetRaid() {
    sessionStorage.removeItem("raidBoss");
    sessionStorage.removeItem("raidTeam");
    router.push("/");
  }

  if (loading || !boss || team.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-slate-100">
        <div>Carregando batalha...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-slate-100">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Raid Battle</h1>
          <div className="text-sm text-gray-400">Round: {round}</div>
        </header>

        <main className="bg-gray-800/60 rounded-2xl shadow-lg p-6 border border-gray-700">
          {/* Boss */}
          <BossCombatDisplay boss={boss} />

          {/* Equipe */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-100">Sua Equipe</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              {team.map((t, idx) => (
                <BattleCombatant
                  key={t.id}
                  combatant={t}
                  selected={selectedAllyIndex === idx}
                  onSelect={() => setSelectedAllyIndex(idx)}
                  disabled={finished}
                />
              ))}
            </div>

            {/* Seletor de Movimentos */}
            <MoveSelector
              combatant={selectedAllyIndex !== null ? team[selectedAllyIndex] : null}
              selectedMoveIndex={selectedMoveIndex}
              onSelectMove={setSelectedMoveIndex}
              disabled={finished}
            />
          </section>

          {/* Controles */}
          <div className="mt-4 flex gap-3 items-center">
            <button
              onClick={handlePlayerAttack}
              disabled={
                selectedAllyIndex === null ||
                selectedMoveIndex === null ||
                finished
              }
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Atacar
            </button>

            <button
              onClick={resetRaid}
              className="px-4 py-2 rounded bg-gray-700 text-slate-100 hover:bg-gray-600"
            >
              Voltar / Reiniciar
            </button>

            {finished && winner === "player" && (
              <div className="ml-auto text-emerald-400 font-bold">
                Vitória! Você derrotou o boss.
              </div>
            )}
            {finished && winner === "boss" && (
              <div className="ml-auto text-red-400 font-bold">
                Derrota. Sua equipe foi derrotada.
              </div>
            )}
          </div>

          {/* Log de Combate */}
          <BattleLog logs={log} />
        </main>
      </div>
    </div>
  );
}
