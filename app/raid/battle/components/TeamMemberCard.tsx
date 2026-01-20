"use client";
import Image from "next/image";
import { Combatant } from "@/libs/pokemonUtils";

type TeamMemberCardProps = {
  member: Combatant;
  index: number;
  selected: boolean;
  onSelect: (index: number) => void;
  finished: boolean;
};

export function TeamMemberCard({
  member,
  index,
  selected,
  onSelect,
  finished,
}: TeamMemberCardProps) {
  const alive = member.hp > 0;
  const hasAttacked = member.hasAttackedThisRound;

  return (
    <div
      className={`w-40 bg-gray-900 border ${selected ? "border-emerald-400" : "border-gray-700"} p-3 rounded-xl text-center ${hasAttacked ? "opacity-60" : ""}`}
    >
      <div className="w-28 h-28 mx-auto bg-gray-800 rounded-lg flex items-center justify-center">
        {member.sprite ? (
          <Image src={member.sprite} alt={member.name} width={96} height={96} />
        ) : null}
      </div>
      <div className="capitalize font-medium mt-2 text-slate-100">
        {member.name}
      </div>
      <div className="text-sm text-gray-400">Lv {member.level}</div>
      <div className="text-sm mt-1 text-slate-100">
        HP: {member.hp}/{member.hpMax}
      </div>
      <div className="w-full h-2 bg-gray-700 rounded mt-2 overflow-hidden">
        <div
          className={`h-2 transition-all duration-500 ${
            member.hp / member.hpMax > 0.5
              ? "bg-green-500"
              : member.hp / member.hpMax > 0.2
                ? "bg-yellow-400"
                : "bg-red-500"
          }`}
          style={{ width: `${(member.hp / member.hpMax) * 100}%` }}
        />
      </div>

      <div className="mt-3">
        <button
          onClick={() => onSelect(alive && !hasAttacked ? index : -1)}
          className={`px-3 py-1 rounded text-sm ${selected ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"}`}
          disabled={!alive || hasAttacked || finished}
          title={hasAttacked ? "Já atacou nesta rodada" : ""}
        >
          {hasAttacked ? "Atacou" : selected ? "Selecionado" : alive ? "Selecionar" : "Nocauteado"}
        </button>
      </div>
    </div>
  );
}
