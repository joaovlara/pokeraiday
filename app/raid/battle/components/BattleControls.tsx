"use client";

type BattleControlsProps = {
  onAttack: () => void;
  onReset: () => void;
  disabled: boolean;
  finished: boolean;
  winner: "player" | "boss" | null;
};

export function BattleControls({
  onAttack,
  onReset,
  disabled,
  finished,
  winner,
}: BattleControlsProps) {
  return (
    <div className="mt-4 flex gap-3 items-center">
      <button
        onClick={onAttack}
        disabled={disabled}
        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        Atacar
      </button>

      <button
        onClick={onReset}
        className="px-4 py-2 rounded bg-gray-700 text-slate-100 hover:bg-gray-600"
      >
        Voltar / Reiniciar
      </button>

      {finished && winner === "player" && (
        <div className="ml-auto text-emerald-400 font-bold">
          Vitória! Você derrotou o boss.
        </div>
      )}
      {finished && winner === "boss" && (
        <div className="ml-auto text-red-400 font-bold">
          Derrota. Sua equipe foi derrotada.
        </div>
      )}
    </div>
  );
}
