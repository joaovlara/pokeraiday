import Image from "next/image";
import { Pokemon } from "@/types/pokemon";

interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect?: () => void;
  onRemove?: () => void;
  isSelected?: boolean;
  isDisabled?: boolean;
  showStats?: boolean;
  variant?: "compact" | "detailed";
}

export function PokemonCard({
  pokemon,
  onSelect,
  onRemove,
  isSelected = false,
  isDisabled = false,
  showStats = true,
  variant = "compact",
}: PokemonCardProps) {
  if (variant === "compact") {
    return (
      <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center w-36">
        <Image
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          width={72}
          height={72}
          className="drop-shadow"
        />
        <span className="capitalize font-medium mt-2 text-center">
          {pokemon.name}
        </span>
        {onRemove && (
          <button
            className="mt-3 text-sm text-red-600 hover:underline"
            onClick={onRemove}
          >
            Remover
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
      <Image
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        width={96}
        height={96}
        className="drop-shadow"
      />
      <div className="flex-1">
        <h2 className="text-2xl font-semibold capitalize">{pokemon.name}</h2>
        {showStats && (
          <ul className="mt-2 text-sm text-gray-700">
            {pokemon.stats
              .filter((s) =>
                ["hp", "attack", "defense", "speed"].includes(s.stat.name)
              )
              .map((s) => (
                <li
                  key={s.stat.name}
                  className="capitalize flex justify-between"
                >
                  <span>{s.stat.name}</span>
                  <span className="font-medium">{s.base_stat}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
      {onSelect && (
        <div className="flex flex-col gap-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
            onClick={onSelect}
            disabled={isDisabled}
          >
            Selecionar
          </button>
        </div>
      )}
    </div>
  );
}
