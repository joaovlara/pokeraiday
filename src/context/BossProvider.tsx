"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { BossEntity, toBossEntity } from "@/entities/boss";
import { fetchRandomPokemon } from "@/services/pokeapi";

type BossContextType = {
  boss: BossEntity | null;
  setBoss: React.Dispatch<React.SetStateAction<BossEntity | null>>;};

const BossContext = createContext<BossContextType | undefined>(undefined);

export const BossProvider = ({ children }: { children: React.ReactNode }) => {
  const [boss, setBoss] = useState<BossEntity | null>(null);

  useEffect(() => {
    const loadBoss = async () => {
      const apiData = await fetchRandomPokemon();
      const bossEntity = toBossEntity(apiData);
      setBoss(bossEntity);
    };
    loadBoss();
  }, []);

  return (
    <BossContext.Provider value={{ boss, setBoss }}>
      {children}
    </BossContext.Provider>
  );
};

export const useBoss = () => {
  const context = useContext(BossContext);
  if (!context) {
    throw new Error("useBoss deve ser usado dentro de BossProvider");
  }
  return context;
};
