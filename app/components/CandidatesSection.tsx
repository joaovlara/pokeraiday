"use client";
import { CandidateCard } from "./CandidateCard";

type Candidate = { raw: any; level: number };

type CandidatesSectionProps = {
  candidates: Candidate[];
  chosen: Candidate[];
  onToggleChoose: (candidate: Candidate) => void;
  onStartRaid: () => void;
};

export function CandidatesSection({
  candidates,
  chosen,
  onToggleChoose,
  onStartRaid,
}: CandidatesSectionProps) {
  if (candidates.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Escolha 5 entre 8 candidatos
      </h2>
      <div className="grid grid-cols-4 gap-4">
        {candidates.map((c, i) => {
          const isChosen = !!chosen.find(
            (ch) => ch.raw.id === c.raw.id && ch.level === c.level,
          );
          return (
            <CandidateCard
              key={`${c.raw.id}-${c.level}-${i}`}
              candidate={c}
              isChosen={isChosen}
              onToggle={onToggleChoose}
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
          / 5
        </div>
        <div className="flex gap-3">
          <button
            onClick={onStartRaid}
            disabled={chosen.length !== 5}
            className="px-5 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
          >
            Iniciar Raid
          </button>
        </div>
      </div>
    </section>
  );
}
