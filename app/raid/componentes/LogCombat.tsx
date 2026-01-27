"use client";

interface LogCombatProps {
  log: string[];
}

const LogCombat = ({ log }: LogCombatProps) => {
  return (
    <section className="w-full max-w-2xl border-card bg-neutral-900 p-4 rounded-lg">
      <h2 className="text-emphasis mb-3">Registro da Batalha</h2>
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {log.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhuma ação registrada ainda...</p>
        ) : (
          log.map((entry, i) => (
            <p key={i} className="text-sm text-white">
              {entry}
            </p>
          ))
        )}
      </div>
    </section>
  );
};

export default LogCombat;
