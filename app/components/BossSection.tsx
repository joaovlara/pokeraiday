"use client";
import Image from "next/image";

type BossSectionProps = {
  boss: any | null;
  loadingBoss: boolean;
  loadingCandidates: boolean;
  onDesafiar: () => void;
};

export function BossSection({
  boss,
  loadingBoss,
  loadingCandidates,
  onDesafiar,
}: BossSectionProps) {
  return (
    <section className="flex flex-col items-center justify-center bg-gray-800/60 border border-gray-700 rounded-2xl p-8 mb-6 shadow-lg">
      {loadingBoss ? (
        <div className="text-lg text-gray-300">Sorteando boss...</div>
      ) : boss ? (
        <>
          <div className="w-40 h-40 flex items-center justify-center bg-gray-800 rounded-lg mb-4">
            {boss.sprites?.front_default ? (
              <Image
                src={boss.sprites.front_default}
                alt={boss.name}
                width={160}
                height={160}
                className="drop-shadow-lg"
              />
            ) : (
              <div className="text-sm text-gray-400">Sem sprite</div>
            )}
          </div>

          <div className="text-2xl font-semibold capitalize">
            {boss.name}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Nível 100 · IV 31
          </div>

          <div className="mt-6">
            <button
              onClick={onDesafiar}
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-60"
              disabled={loadingCandidates}
            >
              {loadingCandidates ? "Sorteando equipe..." : "Desafiar"}
            </button>
          </div>
        </>
      ) : (
        <div className="text-red-400">
          Erro ao sortear boss. Recarregue a página.
        </div>
      )}
    </section>
  );
}
