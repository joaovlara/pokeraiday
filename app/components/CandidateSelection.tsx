// app/components/CandidateSelection.tsx
import React from "react";
import PokemonCard from "./PokemonCard";
import { Candidate } from "@/app/hooks/useRaidCandidates";

interface CandidateSelectionProps {
  candidates: Candidate[];
  chosen: Candidate[];
  onToggleChoose: (candidate: Candidate) => void;
  onStartRaid: () => void;
  maxTeamSize?: number;
}

export default function CandidateSelection({
  candidates,
  chosen,
  onToggleChoose,
  onStartRaid,
  maxTeamSize = 5,
}: CandidateSelectionProps) {
  if (candidates.length === 0) return null;

  return (
    <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Escolha {maxTeamSize} entre {candidates.length} candidatos
      </h2>
      <div className="grid grid-cols-4 gap-4">
        {candidates.map((c, i) => {
          const isChosen = !!chosen.find(
            (ch) => ch.raw.id === c.raw.id && ch.level === c.level,
          );
          return (
            <PokemonCard
              key={`${c.raw.id}-${c.level}-${i}`}
              name={c.raw.name}
              imageUrl={c.raw.sprites?.front_default}
              level={c.level}
              selected={isChosen}
              onSelect={() => onToggleChoose(c)}
              actionLabel={isChosen ? "Remover" : "Escolher"}
              actionColor={isChosen ? "red" : "indigo"}
            />
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Selecionados:{" "}
          <span className="font-medium text-slate-100">
            {chosen.length}
          </span>{" "}
          / {maxTeamSize}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onStartRaid}
            disabled={chosen.length !== maxTeamSize}
            className="px-5 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
          >
            Iniciar Raid
          </button>
        </div>
      </div>
    </section>
  );
}
