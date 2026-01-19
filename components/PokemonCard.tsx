import Image from "next/image";
import { Pokemon } from "@/types/pokemon";
import { getStat } from "@/lib/utils";

interface PokemonCardProps {
  pokemon: Pokemon;
  isSelected: boolean;
  isChosen: boolean;
  onSelect: (pokemon: Pokemon) => void;
  onRemove?: (name: string) => void;
  compact?: boolean;
}

export function PokemonCard({
  pokemon,
  isSelected,
  isChosen,
  onSelect,
  onRemove,
  compact = false,
}: PokemonCardProps) {
  if (compact) {
    return (
      <div className="bg-white rounded shadow p-2 flex flex-col items-center w-32 relative group">
        <Image
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          width={64}
          height={64}
        />
        <span className="capitalize font-medium mt-1 text-sm">{pokemon.name}</span>
        {onRemove && (
          <button
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(pokemon.name)}
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border-4 border-indigo-300 p-6 flex flex-col items-center w-80 transition-transform hover:scale-105">
      <Image
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        width={96}
        height={96}
      />
      <h2 className="text-xl font-semibold capitalize mt-2">{pokemon.name}</h2>
      <ul className="mt-2 text-left w-full">
        {["hp", "attack", "defense", "speed"].map((statName) => (
          <li key={statName} className="capitalize flex justify-between">
            <span>{statName}:</span>
            <span>{getStat(pokemon, statName)}</span>
          </li>
        ))}
      </ul>
      <button
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 transition"
        onClick={() => onSelect(pokemon)}
        disabled={isChosen || isSelected}
      >
        {isChosen ? "✓ Selecionado" : "Selecionar"}
      </button>
    </div>
  );
}
