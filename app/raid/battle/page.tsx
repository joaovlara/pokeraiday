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
      // checar fim
      if (isBossDead(boss) || isTeamDead(team)) break;

      if (p.type === "ally") {
        const attacker = p.actor;
        if (attacker.hp <= 0) continue;
        const power = 50; // simplificado: power fixo para aliados
        const damage = calcDamage(attacker, boss!, power);
        boss!.hp = Math.max(0, boss!.hp - damage);
        appendLog(`${attacker.name} causou ${damage} de dano ao Boss ${boss!.name}.`);
        setBoss({ ...boss! });
      } else {
        // boss ataca alvo aleatório vivo
        const alive = team.filter((t) => t.hp > 0);
        if (alive.length === 0) break;
        const target = alive[Math.floor(Math.random() * alive.length)];
        const power = 60; // boss tem power maior por padrão
        const damage = calcDamage(boss!, target, power);
        target.hp = Math.max(0, target.hp - damage);
        appendLog(`Boss ${boss!.name} causou ${damage} de dano a ${target.name}.`);
        setTeam((prev) => prev.map((t) => (t.id === target.id ? { ...target } : t)));
      }

      // pequena pausa para dar sensação de sequência (opcional)
      // eslint-disable-next-line no-await-in-loop
      await new Promise((res) => setTimeout(res, 200));
    }

    // checar fim após o round
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
      <div className="min-h-screen flex items-center justify-center">
        <div>Carregando batalha...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-linear-to-br from-yellow-50 to-red-100">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Raid Battle</h1>
          <div className="text-sm text-gray-600">Round: {round}</div>
        </header>

        <main className="bg-white rounded-2xl shadow p-6">
          <div className="flex gap-6">
            <div className="w-1/3 bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold mb-3">Boss</h2>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24">
                  {boss.sprite ? (
                    <Image src={boss.sprite} alt={boss.name} width={96} height={96} />
                  ) : null}
                </div>
                <div>
                  <div className="capitalize font-bold text-lg">{boss.name}</div>
                  <div className="text-sm text-gray-600">Lv {boss.level}</div>
                  <div className="mt-2 text-sm">HP: {boss.hp} / {boss.hpMax}</div>
                  <div className="w-48 h-3 bg-gray-200 rounded mt-2 overflow-hidden">
                    <div
                      className="h-3 bg-red-500 transition-all"
                      style={{ width: `${(boss.hp / boss.hpMax) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold mb-3">Equipe</h2>
              <div className="grid grid-cols-5 gap-3">
                {team.map((t) => (
                  <div key={t.id} className="bg-white p-3 rounded-lg text-center border">
                    <div className="w-20 h-20 mx-auto">
                      {t.sprite ? <Image src={t.sprite} alt={t.name} width={80} height={80} /> : null}
                    </div>
                    <div className="capitalize font-medium mt-2">{t.name}</div>
                    <div className="text-sm text-gray-600">Lv {t.level}</div>
                    <div className="text-sm mt-1">HP: {t.hp}/{t.hpMax}</div>
                    <div className="w-full h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                      <div
                        className={`h-2 ${t.hp / t.hpMax > 0.5 ? "bg-green-500" : t.hp / t.hpMax > 0.2 ? "bg-yellow-400" : "bg-red-500"} transition-all`}
                        style={{ width: `${(t.hp / t.hpMax) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={runRound}
              disabled={running || finished || team.every((t) => t.hp <= 0) || boss.hp <= 0}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
            >
              {running ? "Executando..." : "Executar Round"}
            </button>

            <button onClick={resetRaid} className="px-4 py-2 rounded bg-gray-200">
              Voltar / Reiniciar
            </button>

            {finished && winner === "player" && (
              <div className="ml-auto text-green-700 font-bold">Vitória! Você derrotou o boss.</div>
            )}
            {finished && winner === "boss" && (
              <div className="ml-auto text-red-600 font-bold">Derrota. Sua equipe foi derrotada.</div>
            )}
          </div>

          <section className="mt-6">
            <h3 className="font-semibold mb-2">Log de combate</h3>
            <div className="h-48 overflow-auto bg-black/5 p-3 rounded">
              {log.length === 0 && <div className="text-sm text-gray-500">Nenhuma ação ainda.</div>}
              {log.map((l, i) => (
                <div key={i} className="text-sm mb-1">{l}</div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
