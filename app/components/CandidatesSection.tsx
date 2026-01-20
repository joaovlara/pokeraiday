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
      <h2 className="text-xl font-semibold mb-4 text-center">
        Escolha sua Equipe: {chosen.length}/5
      </h2>

      {/* Grade 3x3 */}
      <div className="grid grid-cols-3 gap-4">
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

        {/* Última célula: botão iniciar */}
        <div
          className={`p-3 rounded-lg border border-gray-700 
    bg-red-600 flex items-center justify-center 
    w-full h-full`}
        >
          <button
            onClick={onStartRaid}
            disabled={chosen.length !== 5}
            className="w-full h-full flex items-center justify-center 
               text-white font-semibold text-lg rounded 
               disabled:opacity-50"
          >
            Iniciar Batalha
          </button>
        </div>
      </div>
    </section>
  );
}
