// app/raid/battle/page.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { buildBossCombatantAsync, buildCandidateCombatantAsync } from "@/libs/raidGenerator";
import { Combatant, calcDamageWithType } from "@/libs/pokemonUtils";

export default function RaidBattlePage() {
  const router = useRouter();
  const [boss, setBoss] = useState<Combatant | null>(null);
  const [team, setTeam] = useState<Combatant[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState<"player" | "boss" | null>(null);

  // seleção do jogador
  const [selectedAllyIndex, setSelectedAllyIndex] = useState<number | null>(null);
  const [selectedMoveIndex, setSelectedMoveIndex] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const bossRaw = sessionStorage.getItem("raidBoss");
      const teamRaw = sessionStorage.getItem("raidTeam");
      if (!bossRaw || !teamRaw) {
        router.push("/");
        return;
      }
      const bossObj = JSON.parse(bossRaw);
      const teamArr = JSON.parse(teamRaw) as { raw: any; level: number }[];

      const bossCombat = await buildBossCombatantAsync(bossObj);
      const teamCombatPromises = teamArr.map((c) => buildCandidateCombatantAsync(c.raw, c.level));
      const teamCombat = await Promise.all(teamCombatPromises);

      bossCombat.hasAttackedThisRound = false;
      teamCombat.forEach((t) => (t.hasAttackedThisRound = false));

      setBoss(bossCombat);
      setTeam(teamCombat);
      setLog([]);
      setRound(0);
      setFinished(false);
      setWinner(null);
    })();
  }, [router]);

  function appendLog(text: string) {
    setLog((l) => [text, ...l].slice(0, 200));
  }

  function isTeamDead(ts: Combatant[]) {
    return ts.every((t) => t.hp <= 0);
  }

  function isBossDead(b: Combatant | null) {
    return !b || b.hp <= 0;
  }

  // jogador executa ataque selecionado
  async function playerAttack() {
    if (selectedAllyIndex === null || selectedMoveIndex === null) return;
    if (!boss) return;
    const attacker = team[selectedAllyIndex];
    if (!attacker || attacker.hp <= 0) {
      appendLog("Escolha um aliado vivo.");
      return;
    }
    if (attacker.hasAttackedThisRound) {
      appendLog(`${attacker.name} já atacou nesta rodada. Aguarde a próxima rodada.`);
      return;
    }
    const move = attacker.moves[selectedMoveIndex];
    if (!move) {
      appendLog("Movimento inválido.");
      return;
    }

    // calcular dano com tipos e STAB
    const { damage, typeMultiplier, stab } = calcDamageWithType(attacker, boss, move);
    boss.hp = Math.max(0, boss.hp - damage);
    attacker.hasAttackedThisRound = true;
    setBoss({ ...boss });
    appendLog(`${attacker.name} usou ${move.name} e causou ${damage} de dano. (x${typeMultiplier.toFixed(2)}${stab > 1 ? ", STAB" : ""})`);

    // reset seleção para próximo turno
    setSelectedAllyIndex(null);
    setSelectedMoveIndex(null);

    // checar vitória imediata
    if (boss.hp <= 0) {
      appendLog(`Vitória! O boss ${boss.name} foi derrotado.`);
      setFinished(true);
      setWinner("player");
      return;
    }

    // verificar se todos os aliados vivos já atacaram
    const aliveleft = team.filter((t) => t.hp > 0 && !t.hasAttackedThisRound);
    if (aliveleft.length === 0) {
      // boss responde
      await bossTurn();
    }
  }

  // boss ataca alvo aleatório
  async function bossTurn() {
    if (!boss || boss.hasAttackedThisRound) return;
    const alive = team.filter((t) => t.hp > 0);
    if (alive.length === 0) return;
    const target = alive[Math.floor(Math.random() * alive.length)];
    const move = boss.moves[0] || { name: "Smash", power: 60, type: "normal" };
    const { damage, typeMultiplier } = calcDamageWithType(boss, target, move);
    target.hp = Math.max(0, target.hp - damage);
    boss.hasAttackedThisRound = true;
    setTeam((prev) => prev.map((t) => (t.id === target.id ? { ...target } : t)));
    setBoss({ ...boss });
    appendLog(`Boss ${boss.name} usou ${move.name} e causou ${damage} a ${target.name}. (x${typeMultiplier.toFixed(2)})`);

    // checar derrota
    if (isTeamDead(team)) {
      appendLog(`Derrota. Toda a equipe foi derrotada.`);
      setFinished(true);
      setWinner("boss");
      return;
    }

    // iniciar próxima rodada - resetar flags de ataque
    appendLog(`--- Fim da Rodada ${round + 1} ---`);
    team.forEach((t) => (t.hasAttackedThisRound = false));
    boss.hasAttackedThisRound = false;
    setTeam([...team]);
    setBoss({ ...boss });
    setRound((r) => r + 1);
  }

  function resetRaid() {
    sessionStorage.removeItem("raidBoss");
    sessionStorage.removeItem("raidTeam");
    router.push("/");
  }

  if (!boss) {
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
          {/* Boss no topo (igual layout anterior) */}
          <section className="flex flex-col items-center mb-8">
            <div className="w-56 h-56 bg-gray-800 rounded-full flex items-center justify-center shadow-inner">
              {boss.sprite ? <Image src={boss.sprite} alt={boss.name} width={220} height={220} /> : null}
            </div>
            <div className="mt-4 text-center">
              <div className="capitalize text-2xl font-bold text-slate-100">{boss.name}</div>
              <div className="text-sm text-gray-400 mt-1">Lv {boss.level}</div>
              <div className="mt-3 text-sm text-slate-100">HP: {boss.hp} / {boss.hpMax}</div>
              <div className="w-80 h-4 bg-gray-700 rounded-full mt-2 overflow-hidden">
                <div className="h-4 bg-red-500 transition-all duration-500" style={{ width: `${(boss.hp / boss.hpMax) * 100}%` }} />
              </div>
            </div>
          </section>

          {/* Equipe e seleção */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-100">Sua Equipe</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              {team.map((t, idx) => {
                const alive = t.hp > 0;
                const hasAttacked = t.hasAttackedThisRound;
                const selected = selectedAllyIndex === idx;
                return (
                  <div key={t.id} className={`w-40 bg-gray-900 border ${selected ? "border-emerald-400" : "border-gray-700"} p-3 rounded-xl text-center ${hasAttacked ? "opacity-60" : ""}`}>
                    <div className="w-28 h-28 mx-auto bg-gray-800 rounded-lg flex items-center justify-center">
                      {t.sprite ? <Image src={t.sprite} alt={t.name} width={96} height={96} /> : null}
                    </div>
                    <div className="capitalize font-medium mt-2 text-slate-100">{t.name}</div>
                    <div className="text-sm text-gray-400">Lv {t.level}</div>
                    <div className="text-sm mt-1 text-slate-100">HP: {t.hp}/{t.hpMax}</div>
                    <div className="w-full h-2 bg-gray-700 rounded mt-2 overflow-hidden">
                      <div className={`h-2 transition-all duration-500 ${t.hp / t.hpMax > 0.5 ? "bg-green-500" : t.hp / t.hpMax > 0.2 ? "bg-yellow-400" : "bg-red-500"}`} style={{ width: `${(t.hp / t.hpMax) * 100}%` }} />
                    </div>

                    <div className="mt-3">
                      <button
                        onClick={() => setSelectedAllyIndex(alive && !hasAttacked ? idx : null)}
                        className={`px-3 py-1 rounded text-sm ${selected ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"}`}
                        disabled={!alive || hasAttacked || finished}
                        title={hasAttacked ? "Já atacou nesta rodada" : ""}
                      >
                        {hasAttacked ? "Atacou" : selected ? "Selecionado" : alive ? "Selecionar" : "Nocauteado"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Moves do aliado selecionado */}
            <div className="mt-6">
              <h3 className="text-sm text-gray-300 mb-2">Golpes</h3>
              <div className="grid grid-cols-4 gap-2">
                {selectedAllyIndex !== null ? (
                  team[selectedAllyIndex].moves.map((m, mi) => {
                    const disabled = !team[selectedAllyIndex] || team[selectedAllyIndex].hp <= 0 || finished;
                    const isSel = selectedMoveIndex === mi;
                    return (
                      <button
                        key={mi}
                        onClick={() => setSelectedMoveIndex(mi)}
                        className={`px-2 py-2 rounded text-sm ${isSel ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"} disabled:opacity-50`}
                        disabled={disabled}
                      >
                        <div className="capitalize">{m.name.replace("-", " ")}</div>
                        <div className="text-xs text-gray-200">{m.power ?? "—"} {m.type ? `· ${m.type}` : ""}</div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-sm text-gray-400 col-span-4">Selecione um aliado para ver seus golpes.</div>
                )}
              </div>
            </div>
          </section>

          {/* Controles */}
          <div className="mt-4 flex gap-3 items-center">
            <button
              onClick={playerAttack}
              disabled={selectedAllyIndex === null || selectedMoveIndex === null || running || finished}
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Atacar
            </button>

            <button onClick={resetRaid} className="px-4 py-2 rounded bg-gray-700 text-slate-100 hover:bg-gray-600">
              Voltar / Reiniciar
            </button>

            {finished && winner === "player" && <div className="ml-auto text-emerald-400 font-bold">Vitória! Você derrotou o boss.</div>}
            {finished && winner === "boss" && <div className="ml-auto text-red-400 font-bold">Derrota. Sua equipe foi derrotada.</div>}
          </div>

          {/* Log */}
          <section className="mt-6">
            <h3 className="font-semibold mb-2 text-slate-100">Log de combate</h3>
            <div className="h-48 overflow-auto bg-gray-900/60 p-3 rounded border border-gray-800">
              {log.length === 0 && <div className="text-sm text-gray-400">Nenhuma ação ainda.</div>}
              {log.map((l, i) => <div key={i} className="text-sm mb-1 text-slate-100">{l}</div>)}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
