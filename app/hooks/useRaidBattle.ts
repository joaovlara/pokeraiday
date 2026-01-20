// app/hooks/useRaidBattle.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Combatant, calcDamageWithType } from "@/libs/pokemonUtils";
import {
  buildBossCombatantAsync,
  buildCandidateCombatantAsync,
  isTeamDead,
  isBossDead,
} from "@/libs/services/combatantService";
import { Candidate } from "./useRaidCandidates";

export function useRaidBattle() {
  const router = useRouter();
  const [boss, setBoss] = useState<Combatant | null>(null);
  const [team, setTeam] = useState<Combatant[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState<"player" | "boss" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const bossRaw = sessionStorage.getItem("raidBoss");
      const teamRaw = sessionStorage.getItem("raidTeam");
      if (!bossRaw || !teamRaw) {
        router.push("/");
        return;
      }

      try {
        const bossObj = JSON.parse(bossRaw);
        const teamArr = JSON.parse(teamRaw) as Candidate[];

        const bossCombat = await buildBossCombatantAsync(bossObj);
        const teamCombatPromises = teamArr.map((c) =>
          buildCandidateCombatantAsync(c.raw, c.level),
        );
        const teamCombat = await Promise.all(teamCombatPromises);

        bossCombat.hasAttackedThisRound = false;
        teamCombat.forEach((t) => (t.hasAttackedThisRound = false));

        setBoss(bossCombat);
        setTeam(teamCombat);
        setLog([`--- Rodada 1 ---`]);
        setRound(1);
        setFinished(false);
        setWinner(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  function appendLog(text: string) {
    setLog((l) => [text, ...l].slice(0, 200));
  }

  function executePlayerAttack(
    allyIndex: number,
    moveIndex: number,
  ): boolean {
    if (!boss || allyIndex < 0 || allyIndex >= team.length) return false;

    const attacker = team[allyIndex];
    if (attacker.hp <= 0) {
      appendLog("Escolha um aliado vivo.");
      return false;
    }

    if (attacker.hasAttackedThisRound) {
      appendLog(
        `${attacker.name} já atacou nesta rodada. Aguarde a próxima rodada.`,
      );
      return false;
    }

    const move = attacker.moves[moveIndex];
    if (!move) {
      appendLog("Movimento inválido.");
      return false;
    }

    const { damage, typeMultiplier, stab } = calcDamageWithType(
      attacker,
      boss,
      move,
    );
    boss.hp = Math.max(0, boss.hp - damage);
    attacker.hasAttackedThisRound = true;
    setBoss({ ...boss });

    const stabText = stab > 1 ? ", STAB" : "";
    appendLog(
      `${attacker.name} usou ${move.name} e causou ${damage} de dano. (x${typeMultiplier.toFixed(2)}${stabText})`,
    );

    if (boss.hp <= 0) {
      appendLog(`Vitória! O boss ${boss.name} foi derrotado.`);
      setFinished(true);
      setWinner("player");
      return true;
    }

    return true;
  }

  function executeBossAttack() {
    if (!boss) return;

    const aliveTeam = team.filter((t) => t.hp > 0);
    if (aliveTeam.length === 0) {
      appendLog("Derrota! Todos os aliados foram derrotados.");
      setFinished(true);
      setWinner("boss");
      return;
    }

    const target = aliveTeam[Math.floor(Math.random() * aliveTeam.length)];
    const move = boss.moves[Math.floor(Math.random() * boss.moves.length)];

    const { damage, typeMultiplier, stab } = calcDamageWithType(boss, target, move);
    target.hp = Math.max(0, target.hp - damage);
    boss.hasAttackedThisRound = true;
    setTeam([...team]);

    const stabText = stab > 1 ? ", STAB" : "";
    appendLog(
      `${boss.name} usou ${move.name} em ${target.name} e causou ${damage} de dano. (x${typeMultiplier.toFixed(2)}${stabText})`,
    );

    if (target.hp <= 0) {
      appendLog(`${target.name} foi derrotado!`);
    }

    // Verificar derrota
    if (team.every((t) => t.hp <= 0)) {
      appendLog("Derrota! Todos os aliados foram derrotados.");
      setFinished(true);
      setWinner("boss");
      return;
    }

    // Passar para próxima rodada se todos atacaram
    setTimeout(() => {
      const allAttacked = team.every((t) => t.hp <= 0 || t.hasAttackedThisRound) && boss.hasAttackedThisRound;
      if (allAttacked) {
        startNewRound();
      }
    }, 300);
  }

  function startNewRound() {
    // Resetar flags de ataque para todos os combatentes
    setRound((r) => {
      const newRound = r + 1;
      appendLog(`--- Rodada ${newRound} ---`);
      return newRound;
    });
    
    setBoss((b) => {
      if (b) b.hasAttackedThisRound = false;
      return b ? { ...b } : null;
    });
    
    setTeam((t) => {
      const updated = t.map((combatant) => ({
        ...combatant,
        hasAttackedThisRound: false,
      }));
      return updated;
    });
  }

  return {
    boss,
    team,
    log,
    round,
    running,
    finished,
    winner,
    loading,
    appendLog,
    executePlayerAttack,
    executeBossAttack,
    startNewRound,
    isTeamDead: () => isTeamDead(team),
    isBossDead: () => isBossDead(boss),
    setRunning,
    setRound,
  };
}
