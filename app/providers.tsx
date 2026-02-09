"use client";

import { BattleProvider } from "@/context/battle.context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <BattleProvider>{children}</BattleProvider>;
}
