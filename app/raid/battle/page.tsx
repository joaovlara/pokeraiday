// app/raid/battle/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildBossCombatantAsync, buildCandidateCombatantAsync } from "@/libs/raidGenerator";
import { Combatant, calcDamageWithType } from "@/libs/pokemonUtils";
import { BossBattle } from "./components/BossBattle";
import { TeamSection } from "./components/TeamSection";
import { BattleControls } from "./components/BattleControls";
import { BattleLog } from "./components/BattleLog";

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
          <BossBattle boss={boss} round={round} />

          <TeamSection
            team={team}
            selectedAllyIndex={selectedAllyIndex}
            onSelectAlly={setSelectedAllyIndex}
            finished={finished}
            selectedMoveIndex={selectedMoveIndex}
            onSelectMove={setSelectedMoveIndex}
          />

          <BattleControls
            onAttack={playerAttack}
            onReset={resetRaid}
            disabled={
              selectedAllyIndex === null ||
              selectedMoveIndex === null ||
              running ||
              finished
            }
            finished={finished}
            winner={winner}
          />

          <BattleLog log={log} />
        </main>
      </div>
    </div>
  );
}
