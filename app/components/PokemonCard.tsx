// app/components/PokemonCard.tsx
import Image from "next/image";
import React from "react";

interface PokemonCardProps {
  name: string;
  imageUrl?: string;
  level?: number;
  selected?: boolean;
  onSelect?: () => void;
  actionLabel?: string;
  actionColor?: "indigo" | "red" | "emerald";
  disabled?: boolean;
}

export default function PokemonCard({
  name,
  imageUrl,
  level,
  selected,
  onSelect,
  actionLabel = "Escolher",
  actionColor = "indigo",
  disabled,
}: PokemonCardProps) {
  const colorClass = {
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    red: "bg-red-600 hover:bg-red-700",
    emerald: "bg-emerald-600 hover:bg-emerald-700",
  }[actionColor];

  const borderClass = selected ? "ring-2 ring-green-400 border-green-600" : "border-gray-700";

  return (
    <div
      className={`p-3 rounded-lg border ${borderClass} bg-gray-900 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="w-20 h-20 mx-auto">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={80}
            height={80}
            priority
          />
        ) : (
          <div className="text-sm text-gray-400">Sem sprite</div>
        )}
      </div>
      <div className="capitalize font-medium mt-2 text-center text-slate-100">
        {name}
      </div>
      {level && (
        <div className="text-sm text-gray-400 mt-1 text-center">
          Lv {level}
        </div>
      )}
      {onSelect && (
        <div className="mt-3 flex justify-center">
          <button
            onClick={onSelect}
            disabled={disabled}
            className={`px-3 py-1 rounded text-sm text-white ${colorClass} disabled:opacity-50`}
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
