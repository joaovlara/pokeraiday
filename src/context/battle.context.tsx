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

  // 👉 Aqui você substitui a função nextRound
  const nextRound = () => {
    if (!boss || winner) return;

    const participants = [
      ...team.filter((p) => p.hp > 0),
      ...(boss.hp > 0 ? [boss] : []),
    ];

    const turnOrder = participants.sort(
      (a, b) => (b.stats.speed ?? 0) - (a.stats.speed ?? 0),
    );

    const newLogs: ActionLog[] = [];

    turnOrder.forEach((actor) => {
      if (actor.hp <= 0) return;

      if ("moves" in actor) {
        // Pokémon do jogador
        const move = actor.moves[0];
        const damage = calculateDamage(actor, boss!, move);
        boss!.hp = Math.max(0, boss!.hp - damage);
        newLogs.push({
          actor: actor.name,
          target: boss!.name,
          move: move.name,
          damage,
          remainingHP: boss!.hp,
        });
      } else {
        // Boss
        const aliveTeam = team.filter((p) => p.hp > 0);
        if (aliveTeam.length === 0) return;
        const target = aliveTeam[Math.floor(Math.random() * aliveTeam.length)];
        const move = boss!.moves[0];
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
    });

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
