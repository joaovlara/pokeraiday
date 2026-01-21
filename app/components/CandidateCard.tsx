"use client";
import Image from "next/image";

type Candidate = { raw: any; level: number };

type CandidateCardProps = {
  candidate: Candidate;
  isChosen: boolean;
  onToggle: (candidate: Candidate) => void;
};

export function CandidateCard({
  candidate,
  isChosen,
  onToggle,
}: CandidateCardProps) {
  // pega o sprite do dream_world, se não existir cai no front_default
  const sprite =
    candidate.raw?.sprites?.other?.dream_world?.front_default ||
    candidate.raw?.sprites?.front_default;

  return (
    <div
      onClick={() => onToggle(candidate)}
      className={`cursor-pointer p-3 rounded-lg border 
        ${isChosen ? "ring-2 ring-green-400 border-green-600" : "border-gray-700"} 
        bg-gray-900 flex flex-col items-center justify-center`}
    >
      {/* Ícone */}
      <div className="w-20 h-20 flex items-center justify-center">
        {sprite ? (
          <Image
            src={sprite}
            alt={candidate.raw.name}
            width={80}
            height={80}
          />
        ) : (
          <div className="text-sm text-gray-400">Sem sprite</div>
        )}
      </div>

      {/* Nome */}
      <div className="capitalize font-medium mt-2 text-center text-slate-100">
        {candidate.raw.name}
      </div>
      <div className="text-sm text-gray-400 mt-1 text-center">
        Lv {candidate.level}
      </div>
    </div>
  );
}
