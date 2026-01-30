"use client";

import React, { createContext, useContext, useState } from "react";
import { BossEntity } from "@/entities/boss.entity";
import { PokemonEntity } from "@/entities/pokemon.entity";
import { executeRound, RoundResult } from "@/actions/round";

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
  setLogs: React.Dispatch<React.SetStateAction<ActionLog[]>>;
}

const BattleContext = createContext<BattleContextProps | undefined>(undefined);

export const BattleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [boss, setBoss] = useState<BossEntity | null>(null);
  const [team, setTeam] = useState<PokemonEntity[]>([]);
  const [round, setRound] = useState(0);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [winner, setWinner] = useState<"player" | "boss" | null>(null);

  const startBattle = (bossEntity: BossEntity, teamEntities: PokemonEntity[]) => {
    setBoss(bossEntity);
    setTeam(teamEntities);
    setRound(1);
    setLogs([]);
    setWinner(null);
  };

  const nextRound = () => {
    if (!boss || winner) return;

    // usa a lógica centralizada em round.ts
    const result: RoundResult = executeRound(team, boss);

    // atualiza HPs
    boss.hp = result.bossHp;
    team.forEach((p) => {
      if (result.teamHp[p.name] !== undefined) {
        p.hp = result.teamHp[p.name];
      }
    });

    // atualiza logs e rodada
    setLogs((prev) => [...prev, ...result.log.map((entry) => ({
      // transforma string em ActionLog simples
      actor: "", // se quiser enriquecer, pode ajustar executeRound para já retornar ActionLog
      target: "",
      move: "",
      damage: 0,
      remainingHP: 0,
    }))]);
    setRound((prev) => prev + 1);

    // checagem de vitória pode ser feita no executeRound também
    if (result.bossHp <= 0) {
      setWinner("player");
    } else if (team.every((p) => p.hp <= 0)) {
      setWinner("boss");
    }
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
        setLogs,
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
