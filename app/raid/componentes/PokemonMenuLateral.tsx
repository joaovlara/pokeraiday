"use client";

import { PokemonEntity } from "@/entities/pokemon.entity";
import Image from "next/image";
import { useBattle } from "@/context/battle.context";

interface PokemonMenuLateralProps {
  team: PokemonEntity[];                          // os 5 pokémons escolhidos
  activePokemon: PokemonEntity | null;            // quem está ativo agora
  setActivePokemon: (pokemon: PokemonEntity) => void; // função para trocar ativo
}

const statusColors: Record<string, string> = {
  active: "border-green-500",
  reserve: "border-yellow-500",
  fainted: "border-red-700",
};

export default function PokemonMenuLateral({
  team,
  activePokemon,
  setActivePokemon,
}: PokemonMenuLateralProps) {
  const { hasPokemonAttacked } = useBattle();

  return (
    <aside className="w-20 flex flex-col items-center space-y-4">
      {team.map((pkm) => {
        const isSelected = activePokemon?.id === pkm.id;
        const alive = (pkm.hp ?? 0) > 0;
        const attacked = hasPokemonAttacked(pkm.id);

        // vida em porcentagem (proteção contra divisão por zero)
        const hpPercent =
          pkm.maxHp && pkm.maxHp > 0 ? (pkm.hp / pkm.maxHp) * 100 : 0;

        // borda que indica vida (apenas feedback visual na borda)
        const lifeBorderClass = alive
          ? hpPercent > 66
            ? "ring-4 ring-green-400"
            : hpPercent > 33
            ? "ring-4 ring-yellow-400"
            : "ring-4 ring-red-400"
          : "ring-4 ring-red-700";

        // status visual (ativa, reserva, nocauteado)
        const status = !alive ? "fainted" : isSelected ? "active" : "reserve";
        const baseStatusClass = statusColors[status];

        // quando não disponível para atacar (já atacou ou está nocauteado)
        const disabled = !alive || attacked;
        const opacityClass = disabled ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer";
        const sizeClass = isSelected ? "w-20 h-20 border-4" : "w-16 h-16 border-2";

        return (
          <div key={pkm.id} className="w-full flex flex-col items-center">
            <div
              onClick={() => {
                if (!disabled) setActivePokemon(pkm);
              }}
              role="button"
              aria-pressed={isSelected}
              aria-disabled={disabled}
              title={
                !alive
                  ? `${pkm.name} está nocauteado`
                  : attacked
                  ? `${pkm.name} já atacou`
                  : `${pkm.name} disponível`
              }
              className={`flex items-center justify-center rounded-full transition-all duration-300 ${baseStatusClass} ${sizeClass} ${opacityClass} ${lifeBorderClass}`}
            >
              {pkm.sprite && (
                <Image
                  src={pkm.sprite}
                  alt={pkm.name}
                  width={isSelected ? 60 : 48}
                  height={isSelected ? 60 : 48}
                  className="transition-all duration-300"
                />
              )}
            </div>
          </div>
        );
      })}
    </aside>
  );
}
