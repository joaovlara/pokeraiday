"use client";

import React, { createContext, useContext, useState } from "react";
import { BossEntity } from "@/entities/boss.entity";
import { PokemonEntity } from "@/entities/pokemon.entity";
import { ActionLog, playerAttack, bossCounterAttack, checkWinner } from "@/actions/round";

interface BattleState {
  boss: BossEntity | null;
  team: PokemonEntity[];
  round: number;
  logs: ActionLog[];
  winner: "player" | "boss" | null;
}

interface BattleContextProps extends BattleState {
  startBattle: (boss: BossEntity, team: PokemonEntity[]) => void;
  performTurn: (pokemon: PokemonEntity, move: any) => void; // jogador escolhe ataque
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

  /**
   * Fluxo de um turno: jogador ataca -> boss responde -> checa vencedor
   */
  const performTurn = (pokemon: PokemonEntity, move: any) => {
    if (!boss || winner) return;

    // ataque do jogador
    const { updatedBoss, logs: playerLogs } = playerAttack(pokemon, boss, move);
    setBoss(updatedBoss);

    // contra-ataque do boss
    const bossLogs = bossCounterAttack(updatedBoss, team);

    // atualiza logs
    setLogs((prev) => [...prev, ...playerLogs, ...bossLogs]);

    // checagem de vitória
    const result = checkWinner(updatedBoss, team);
    if (result) setWinner(result);

    // incrementa rodada
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
        performTurn,
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
