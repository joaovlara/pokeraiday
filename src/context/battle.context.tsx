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
  startBattle: (boss: BossEntity, attackers: PokemonEntity[]) => void;
  performTurn: (pokemon: PokemonEntity, move: any) => void;
  resetBattle: () => void;
  setBoss: React.Dispatch<React.SetStateAction<BossEntity | null>>;
  setTeam: React.Dispatch<React.SetStateAction<PokemonEntity[]>>;
  setLogs: React.Dispatch<React.SetStateAction<ActionLog[]>>;
  // novos exports para controle de ataques
  attackedIds: number[]; // ids dos pokémons que já atacaram
  hasPokemonAttacked: (pokemonId: number) => boolean;
  markPokemonAttacked: (pokemonId: number) => void;
}

const BattleContext = createContext<BattleContextProps | undefined>(undefined);

export const BattleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [boss, setBoss] = useState<BossEntity | null>(null);
  const [team, setTeam] = useState<PokemonEntity[]>([]);
  const [round, setRound] = useState(0);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [winner, setWinner] = useState<"player" | "boss" | null>(null);

  // controla quais pokémons já atacaram (por id)
  const [attackedIds, setAttackedIds] = useState<number[]>([]);

  const pickFiveFromAttackers = (attackers: PokemonEntity[], existingTeam: PokemonEntity[] = []): PokemonEntity[] => {
    if (existingTeam && existingTeam.length === 5) {
      return existingTeam;
    }

    const pool = [...attackers];
    const picked: PokemonEntity[] = [];

    while (picked.length < 5 && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool[idx]);
      pool.splice(idx, 1);
    }

    return picked;
  };

  const startBattle = (bossEntity: BossEntity, attackers: PokemonEntity[]) => {
    const finalTeam = pickFiveFromAttackers(attackers, team);

    setBoss(bossEntity);
    setTeam(finalTeam);
    setRound(1);
    setLogs([]);
    setWinner(null);
    setAttackedIds([]); // resetar ataques ao iniciar batalha
  };

  // utilitários para attackedIds
  const hasPokemonAttacked = (pokemonId: number) => attackedIds.includes(pokemonId);
  const markPokemonAttacked = (pokemonId: number) => {
    setAttackedIds((prev) => (prev.includes(pokemonId) ? prev : [...prev, pokemonId]));
  };

  /**
   * performTurn
   * - impede ataque se o pokémon já atacou (hasPokemonAttacked)
   * - marca o pokémon como atacado após executar o ataque
   */
  const performTurn = (pokemon: PokemonEntity, move: any) => {
    if (!boss || winner) return;

    // impede ataque repetido
    if (hasPokemonAttacked(pokemon.id)) return;

    // ataque do jogador
    const { updatedBoss, logs: playerLogs } = playerAttack(pokemon, boss, move);
    setBoss(updatedBoss);

    // marca pokémon como atacado (persistente durante a batalha)
    markPokemonAttacked(pokemon.id);

    // contra-ataque do boss (usa o team atual)
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
    setAttackedIds([]);
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
        setTeam,
        setLogs,
        attackedIds,
        hasPokemonAttacked,
        markPokemonAttacked,
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
