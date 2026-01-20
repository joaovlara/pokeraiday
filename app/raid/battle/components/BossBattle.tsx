"use client";
import Image from "next/image";
import { Combatant } from "@/libs/pokemonUtils";

type BossBattleProps = {
  boss: Combatant;
  round: number;
};

export function BossBattle({ boss, round }: BossBattleProps) {
  return (
    <section className="flex flex-col items-center mb-8">
      <div className="w-56 h-56 bg-gray-800 rounded-full flex items-center justify-center shadow-inner">
        {boss.sprite ? (
          <Image src={boss.sprite} alt={boss.name} width={220} height={220} />
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
            style={{ width: `${(boss.hp / boss.hpMax) * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
