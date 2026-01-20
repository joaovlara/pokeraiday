"use client";

type BattleLogProps = {
  log: string[];
};

export function BattleLog({ log }: BattleLogProps) {
  return (
    <section className="mt-6">
      <h3 className="font-semibold mb-2 text-slate-100">Log de combate</h3>
      <div className="h-48 overflow-auto bg-gray-900/60 p-3 rounded border border-gray-800">
        {log.length === 0 && (
          <div className="text-sm text-gray-400">Nenhuma ação ainda.</div>
        )}
        {log.map((l, i) => (
          <div key={i} className="text-sm mb-1 text-slate-100">
            {l}
          </div>
        ))}
      </div>
    </section>
  );
}
