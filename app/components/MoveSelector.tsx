// app/components/MoveSelector.tsx
import React from "react";
import { Combatant } from "@/libs/pokemonUtils";

interface MoveSelectorProps {
  combatant: Combatant | null;
  selectedMoveIndex: number | null;
  onSelectMove: (index: number) => void;
  disabled?: boolean;
}

export default function MoveSelector({
  combatant,
  selectedMoveIndex,
  onSelectMove,
  disabled,
}: MoveSelectorProps) {
  return (
    <div className="mt-6">
      <h3 className="text-sm text-gray-300 mb-2">Golpes</h3>
      <div className="grid grid-cols-4 gap-2">
        {combatant ? (
          combatant.moves.map((m, mi) => {
            const isSel = selectedMoveIndex === mi;
            return (
              <button
                key={mi}
                onClick={() => onSelectMove(mi)}
                className={`px-2 py-2 rounded text-sm ${
                  isSel ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"
                } disabled:opacity-50`}
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
  );
}
