"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { BossEntity } from "@/entities/boss";
import { createBoss } from "@/actions/battle";

type BossContextType = {
  boss: BossEntity | null;
  setBoss: (boss: BossEntity) => void;
};

const BossContext = createContext<BossContextType | undefined>(undefined);

export const BossProvider = ({ children }: { children: React.ReactNode }) => {
  const [boss, setBoss] = useState<BossEntity | null>(null);

  useEffect(() => {
    const initBoss = async () => {
      const bossData = await createBoss();
      setBoss(bossData);
    };
    initBoss();
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
