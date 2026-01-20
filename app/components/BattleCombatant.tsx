// app/components/BattleCombatant.tsx
import Image from "next/image";
import React from "react";
import { Combatant } from "@/libs/pokemonUtils";

interface BattleCombatantProps {
  combatant: Combatant;
  selected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
}

export default function BattleCombatant({
  combatant,
  selected,
  onSelect,
  disabled,
}: BattleCombatantProps) {
  const alive = combatant.hp > 0;
  const hasAttacked = combatant.hasAttackedThisRound;
  const hpPercentage = (combatant.hp / combatant.hpMax) * 100;

  let hpColor = "bg-green-500";
  if (hpPercentage <= 20) hpColor = "bg-red-500";
  else if (hpPercentage <= 50) hpColor = "bg-yellow-400";

  const buttonLabel = hasAttacked
    ? "Atacou"
    : selected
      ? "Selecionado"
      : alive
        ? "Selecionar"
        : "Nocauteado";

  return (
    <div
      className={`w-40 bg-gray-900 border ${
        selected ? "border-emerald-400" : "border-gray-700"
      } p-3 rounded-xl text-center ${hasAttacked ? "opacity-60" : ""}`}
    >
      <div className="w-28 h-28 mx-auto bg-gray-800 rounded-lg flex items-center justify-center">
        {combatant.sprite ? (
          <Image
            src={combatant.sprite}
            alt={combatant.name}
            width={96}
            height={96}
            priority
          />
        ) : null}
      </div>
      <div className="capitalize font-medium mt-2 text-slate-100">
        {combatant.name}
      </div>
      <div className="text-sm text-gray-400">Lv {combatant.level}</div>
      <div className="text-sm mt-1 text-slate-100">
        HP: {combatant.hp}/{combatant.hpMax}
      </div>
      <div className="w-full h-2 bg-gray-700 rounded mt-2 overflow-hidden">
        <div
          className={`h-2 transition-all duration-500 ${hpColor}`}
          style={{ width: `${Math.max(0, hpPercentage)}%` }}
        />
      </div>

      {onSelect && (
        <div className="mt-3">
          <button
            onClick={onSelect}
            className={`px-3 py-1 rounded text-sm ${
              selected ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"
            }`}
            disabled={!alive || hasAttacked || disabled}
            title={hasAttacked ? "Já atacou nesta rodada" : ""}
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </div>
  );
}
