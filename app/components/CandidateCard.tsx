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
  return (
    <div
      className={`p-3 rounded-lg border ${isChosen ? "ring-2 ring-green-400 border-green-600" : "border-gray-700"} bg-gray-900`}
    >
      <div className="w-20 h-20 mx-auto">
        {candidate.raw?.sprites?.front_default ? (
          <Image
            src={candidate.raw.sprites.front_default}
            alt={candidate.raw.name}
            width={80}
            height={80}
          />
        ) : (
          <div className="text-sm text-gray-400">Sem sprite</div>
        )}
      </div>
      <div className="capitalize font-medium mt-2 text-center text-slate-100">
        {candidate.raw.name}
      </div>
      <div className="text-sm text-gray-400 mt-1 text-center">
        Lv {candidate.level}
      </div>
      <div className="mt-3 flex justify-center">
        <button
          onClick={() => onToggle(candidate)}
          className={`px-3 py-1 rounded text-sm ${isChosen ? "bg-red-600 text-white hover:bg-red-700" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
        >
          {isChosen ? "Remover" : "Escolher"}
        </button>
      </div>
    </div>
  );
}
