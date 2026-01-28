"use client";

import React, { createContext, useContext, useState } from "react";
import { BossEntity } from "@/entities/boss";
import { PokemonEntity } from "@/entities/pokemon";
import { calculateDamage } from "@/utils/damage"; // util que vamos criar

export interface ActionLog {
  actor: string;
  target: string;
  move: string;
  damage: number;
  remainingHP: number;
}

interface BattleState {
  boss: BossEntity | null;
  team: PokemonEntity[];
  round: number;
  logs: ActionLog[];
  winner: "player" | "boss" | null;
}

interface BattleContextProps extends BattleState {
  startBattle: (boss: BossEntity, team: PokemonEntity[]) => void;
  nextRound: () => void;
  resetBattle: () => void;
  setBoss: React.Dispatch<React.SetStateAction<BossEntity | null>>;
}

const BattleContext = createContext<BattleContextProps | undefined>(undefined);

export const BattleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [boss, setBoss] = useState<BossEntity | null>(null);
  const [team, setTeam] = useState<PokemonEntity[]>([]);
  const [round, setRound] = useState(0);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [winner, setWinner] = useState<"player" | "boss" | null>(null);

  const startBattle = (
    bossEntity: BossEntity,
    teamEntities: PokemonEntity[],
  ) => {
    setBoss(bossEntity);
    setTeam(teamEntities);
    setRound(1);
    setLogs([]);
    setWinner(null);
  };

  const nextRound = () => {
    if (!boss || winner) return;

    // Filtra combatentes vivos
    const aliveTeam = team.filter((p) => p.hp > 0);
    const aliveBoss = boss.hp > 0 ? [boss] : [];

    // Ordem de ação: todos os vivos, ordenados por Speed
    const turnOrder = [...aliveTeam].sort(
      (a, b) => (b.stats.speed ?? 0) - (a.stats.speed ?? 0),
    );

    const newLogs: ActionLog[] = [];

    // Cada Pokémon ataca uma vez
    turnOrder.forEach((actor) => {
      if (actor.hp <= 0) return;

      // Escolhe um dos 4 moves do Pokémon
      const move = actor.moves[Math.floor(Math.random() * actor.moves.length)];
      const damage = calculateDamage(actor, boss!, move);

      boss!.hp = Math.max(0, boss!.hp - damage);

      newLogs.push({
        actor: actor.name,
        target: boss!.name,
        move: move.name,
        damage,
        remainingHP: boss!.hp,
      });
    });

    // Boss ataca por último
    if (boss!.hp > 0) {
      const target = aliveTeam[Math.floor(Math.random() * aliveTeam.length)];
      const move = boss!.moves[Math.floor(Math.random() * boss!.moves.length)];
      const damage = calculateDamage(boss!, target, move);

      target.hp = Math.max(0, target.hp - damage);

      newLogs.push({
        actor: boss!.name,
        target: target.name,
        move: move.name,
        damage,
        remainingHP: target.hp,
      });
    }

    // Condições de vitória
    if (boss!.hp <= 0) {
      setWinner("player");
    } else if (team.every((p) => p.hp <= 0)) {
      setWinner("boss");
    }

    setLogs((prev) => [...prev, ...newLogs]);
    setRound((prev) => prev + 1);
  };

  const resetBattle = () => {
    setBoss(null);
    setTeam([]);
    setRound(0);
    setLogs([]);
    setWinner(null);
  };

  return (
    <BattleContext.Provider
      value={{
        boss,
        team,
        round,
        logs,
        winner,
        startBattle,
        nextRound,
        resetBattle,
        setBoss,
      }}
    >
      {children}
    </BattleContext.Provider>
  );
};

export const useBattle = () => {
  const ctx = useContext(BattleContext);
  if (!ctx) throw new Error("useBattle must be used within BattleProvider");
  return ctx;
};
