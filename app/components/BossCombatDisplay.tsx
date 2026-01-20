// app/components/BossDisplay.tsx
import Image from "next/image";
import React from "react";
import { Combatant } from "@/libs/pokemonUtils";

interface BossCombatDisplayProps {
  boss: Combatant;
}

export default function BossCombatDisplay({ boss }: BossCombatDisplayProps) {
  const hpPercentage = (boss.hp / boss.hpMax) * 100;

  return (
    <section className="flex flex-col items-center mb-8">
      <div className="w-56 h-56 bg-gray-800 rounded-full flex items-center justify-center shadow-inner">
        {boss.sprite ? (
          <Image src={boss.sprite} alt={boss.name} width={220} height={220} priority />
        ) : null}
      </div>
      <div className="mt-4 text-center">
        <div className="capitalize text-2xl font-bold text-slate-100">
          {boss.name}
        </div>
        <div className="text-sm text-gray-400 mt-1">Lv {boss.level}</div>
        <div className="mt-3 text-sm text-slate-100">
          HP: {boss.hp} / {boss.hpMax}
        </div>
        <div className="w-80 h-4 bg-gray-700 rounded-full mt-2 overflow-hidden">
          <div
            className="h-4 bg-red-500 transition-all duration-500"
            style={{ width: `${Math.max(0, hpPercentage)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
