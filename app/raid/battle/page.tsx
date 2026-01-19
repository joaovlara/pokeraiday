// app/raid/battle/page.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { buildBossCombatant, buildCandidateCombatant } from "@/libs/raidGenerator";
import { Combatant, calcDamage } from "@/libs/pokemonUtils";

export default function RaidBattlePage() {
  const router = useRouter();
  const [boss, setBoss] = useState<Combatant | null>(null);
  const [team, setTeam] = useState<Combatant[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState<"player" | "boss" | null>(null);

  useEffect(() => {
    const bossRaw = sessionStorage.getItem("raidBoss");
    const teamRaw = sessionStorage.getItem("raidTeam");
    if (!bossRaw || !teamRaw) {
      router.push("/raid/setup");
      return;
    }
    const bossObj = JSON.parse(bossRaw);
    const teamArr = JSON.parse(teamRaw) as { raw: any; level: number }[];

    const bossCombat = buildBossCombatant(bossObj);
    const teamCombat = teamArr.map((c) => buildCandidateCombatant(c.raw, c.level));
    setBoss(bossCombat);
    setTeam(teamCombat);
    setLog([]);
    setRound(0);
    setFinished(false);
    setWinner(null);
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

  async function runRound() {
    if (!boss || running || finished) return;
    setRunning(true);
    setRound((r) => r + 1);

    // montar participantes vivos
    const participants: { actor: Combatant; type: "boss" | "ally" }[] = [];
    if (boss.hp > 0) participants.push({ actor: boss, type: "boss" });
    team.forEach((t) => { if (t.hp > 0) participants.push({ actor: t, type: "ally" }); });

    // ordenar por speed desc
    participants.sort((a, b) => b.actor.spd - a.actor.spd);

    for (const p of participants) {
      if (isBossDead(boss) || isTeamDead(team)) break;

      if (p.type === "ally") {
        const attacker = p.actor;
        if (attacker.hp <= 0) continue;
        const power = 50;
        const damage = calcDamage(attacker, boss!, power);
        boss!.hp = Math.max(0, boss!.hp - damage);
        appendLog(`${attacker.name} causou ${damage} de dano ao Boss ${boss!.name}.`);
        setBoss({ ...boss! });
      } else {
        const alive = team.filter((t) => t.hp > 0);
        if (alive.length === 0) break;
        const target = alive[Math.floor(Math.random() * alive.length)];
        const power = 60;
        const damage = calcDamage(boss!, target, power);
        target.hp = Math.max(0, target.hp - damage);
        appendLog(`Boss ${boss!.name} causou ${damage} de dano a ${target.name}.`);
        setTeam((prev) => prev.map((t) => (t.id === target.id ? { ...target } : t)));
      }

      // pequena pausa para sequência
      // eslint-disable-next-line no-await-in-loop
      await new Promise((res) => setTimeout(res, 200));
    }

    if (isBossDead(boss)) {
      appendLog(`Vitória! O boss ${boss!.name} foi derrotado.`);
      setFinished(true);
      setWinner("player");
    } else if (isTeamDead(team)) {
      appendLog(`Derrota. Toda a equipe foi derrotada.`);
      setFinished(true);
      setWinner("boss");
    }

    setRunning(false);
  }

  function resetRaid() {
    sessionStorage.removeItem("raidBoss");
    sessionStorage.removeItem("raidTeam");
    router.push("/raid/setup");
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
          {/* Boss centralizado no topo */}
          <section className="flex flex-col items-center mb-8">
            <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 flex flex-col items-center w-full">
              <div className="w-full flex justify-center">
                <div className="w-56 h-56 bg-gray-800 rounded-full flex items-center justify-center shadow-inner">
                  {boss.sprite ? (
                    <Image src={boss.sprite} alt={boss.name} width={500} height={500} />
                  ) : null}
                </div>
              </div>

              <div className="mt-4 text-center">
                <div className="capitalize text-2xl font-bold text-slate-100">{boss.name}</div>
                <div className="text-sm text-gray-400 mt-1">Lv {boss.level}</div>

                <div className="mt-3 text-sm text-slate-100">HP: {boss.hp} / {boss.hpMax}</div>
                <div className="w-80 h-4 bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-4 bg-red-500 transition-all duration-500"
                    style={{ width: `${(boss.hp / boss.hpMax) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Equipe abaixo do boss */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-100">Sua Equipe</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              {team.map((t) => (
                <div key={t.id} className="w-40 bg-gray-900 border border-gray-700 p-3 rounded-xl text-center">
                  <div className="w-28 h-28 mx-auto bg-gray-800 rounded-lg flex items-center justify-center">
                    {t.sprite ? <Image src={t.sprite} alt={t.name} width={96} height={96} /> : null}
                  </div>
                  <div className="capitalize font-medium mt-2 text-slate-100">{t.name}</div>
                  <div className="text-sm text-gray-400">Lv {t.level}</div>
                  <div className="text-sm mt-1 text-slate-100">HP: {t.hp}/{t.hpMax}</div>
                  <div className="w-full h-2 bg-gray-700 rounded mt-2 overflow-hidden">
                    <div
                      className={`h-2 transition-all duration-500 ${t.hp / t.hpMax > 0.5 ? "bg-green-500" : t.hp / t.hpMax > 0.2 ? "bg-yellow-400" : "bg-red-500"}`}
                      style={{ width: `${(t.hp / t.hpMax) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Controles e status */}
          <div className="mt-4 flex gap-3 items-center">
            <button
              onClick={runRound}
              disabled={running || finished || team.every((t) => t.hp <= 0) || boss.hp <= 0}
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {running ? "Executando..." : "Executar Round"}
            </button>

            <button onClick={resetRaid} className="px-4 py-2 rounded bg-gray-700 text-slate-100 hover:bg-gray-600">
              Voltar / Reiniciar
            </button>

            {finished && winner === "player" && (
              <div className="ml-auto text-emerald-400 font-bold">Vitória! Você derrotou o boss.</div>
            )}
            {finished && winner === "boss" && (
              <div className="ml-auto text-red-400 font-bold">Derrota. Sua equipe foi derrotada.</div>
            )}
          </div>

          {/* Log */}
          <section className="mt-6">
            <h3 className="font-semibold mb-2 text-slate-100">Log de combate</h3>
            <div className="h-48 overflow-auto bg-gray-900/60 p-3 rounded border border-gray-800">
              {log.length === 0 && <div className="text-sm text-gray-400">Nenhuma ação ainda.</div>}
              {log.map((l, i) => (
                <div key={i} className="text-sm mb-1 text-slate-100">{l}</div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
