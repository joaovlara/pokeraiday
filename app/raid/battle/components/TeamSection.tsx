"use client";
import { Combatant } from "@/libs/pokemonUtils";
import { TeamMemberCard } from "./TeamMemberCard";

type TeamSectionProps = {
  team: Combatant[];
  selectedAllyIndex: number | null;
  onSelectAlly: (index: number) => void;
  finished: boolean;
  selectedMoveIndex: number | null;
  onSelectMove: (index: number) => void;
};

export function TeamSection({
  team,
  selectedAllyIndex,
  onSelectAlly,
  finished,
  selectedMoveIndex,
  onSelectMove,
}: TeamSectionProps) {
  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-4 text-slate-100">Sua Equipe</h2>
      <div className="flex gap-4 justify-center flex-wrap">
        {team.map((t, idx) => (
          <TeamMemberCard
            key={t.id}
            member={t}
            index={idx}
            selected={selectedAllyIndex === idx}
            onSelect={onSelectAlly}
            finished={finished}
          />
        ))}
      </div>

      {/* Moves do aliado selecionado */}
      <div className="mt-6">
        <h3 className="text-sm text-gray-300 mb-2">Golpes</h3>
        <div className="grid grid-cols-4 gap-2">
          {selectedAllyIndex !== null ? (
            team[selectedAllyIndex].moves.map((m, mi) => {
              const disabled =
                !team[selectedAllyIndex] ||
                team[selectedAllyIndex].hp <= 0 ||
                finished;
              const isSel = selectedMoveIndex === mi;
              return (
                <button
                  key={mi}
                  onClick={() => onSelectMove(mi)}
                  className={`px-2 py-2 rounded text-sm ${isSel ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"} disabled:opacity-50`}
                  disabled={disabled}
                >
                  <div className="capitalize">{m.name.replace("-", " ")}</div>
                  <div className="text-xs text-gray-200">
                    {m.power ?? "—"} {m.type ? `· ${m.type}` : ""}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-sm text-gray-400 col-span-4">
              Selecione um aliado para ver seus golpes.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
