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
    <section className="flex flex-col items-center justify-center bg-linear-to-b from-gray-900 via-gray-900 to-gray-800 rounded-2xl p-12 mb-6 shadow-lg min-h-96">
      <h2 className="text-gray-500 text-sm font-bold tracking-wider mb-6 uppercase">
        Desafio do dia
      </h2>

      {loadingBoss ? (
        <div className="text-lg text-gray-300">Sorteando boss...</div>
      ) : boss ? (
        <>
          <div className="text-4xl font-black capitalize text-white mb-8 text-center">
            {boss.name}
          </div>

          <div className="w-64 h-64 flex items-center justify-center mb-8 relative">
            {boss.sprites?.front_default ? (
              <Image
                src={boss.sprites.front_default}
                alt={boss.name}
                width={256}
                height={256}
                className="drop-shadow-lg"
                priority
              />
            ) : (
              <div className="text-sm text-gray-400">Sem sprite</div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-gray-400 font-medium">Nível 100</span>
            <div className="flex gap-3">
              <button
                className="w-10 h-10 rounded-full bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center text-lg font-bold shadow-lg transition"
                title="Tipo principal"
              >
                ⚡
              </button>
              <button
                className="w-10 h-10 rounded-full bg-gray-500 hover:bg-gray-600 flex items-center justify-center shadow-lg transition"
                title="Sem tipo secundário"
              >
              </button>
            </div>
          </div>

          <button
            onClick={onDesafiar}
            className="px-12 py-3 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold text-lg disabled:opacity-60 transition shadow-lg uppercase tracking-wide mb-8 w-full max-w-xs"
            disabled={loadingCandidates}
          >
            {loadingCandidates ? "Sorteando equipe..." : "Desafiar"}
          </button>
        </>
      ) : (
        <div className="text-red-400">
          Erro ao sortear boss. Recarregue a página.
        </div>
      )}
    </section>
  );
}
