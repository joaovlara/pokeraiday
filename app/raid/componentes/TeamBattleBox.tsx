"use client";

import PokemonStats from "./PokemonStats";
import PokemonMenuLateral from "./PokemonMenuLateral";
import { PokemonEntity } from "@/entities/pokemon";
import { BossEntity } from "@/entities/boss";
import { calculateDamage } from "@/utils/damage";
import { ActionLog, useBattle } from "@/context/battle.context";

interface TeamBattleBoxProps {
  team: PokemonEntity[];
  boss: BossEntity | null;
  activePokemon: PokemonEntity | null;
  setActivePokemon: (pokemon: PokemonEntity) => void;
}

const TeamBattleBox = ({
  team,
  boss,
  activePokemon,
  setActivePokemon,
}: TeamBattleBoxProps) => {
  const { setBoss, setLogs } = useBattle(); // usa setters do contexto

  const handleAttack = (move: any, pokemon: PokemonEntity) => {
    if (!boss) return;

    // calcula dano real
    const dano = calculateDamage(pokemon, boss, move);

    // atualiza HP do boss
    setBoss((prev: BossEntity | null) =>
      prev ? { ...prev, hp: Math.max(prev.hp - dano, 0) } : prev,
    );

    // adiciona mensagem no log
    setLogs((prev: ActionLog[]) => [
      ...prev,
      {
        actor: pokemon.name,
        target: boss.name,
        move: move.name,
        damage: dano,
        remainingHP: Math.max(boss.hp - dano, 0),
      },
    ]);
  };

  return (
    <section className="flex flex-row w-full">
      {/* Stats do pokémon ativo */}
      {activePokemon && (
        <PokemonStats
          pokemon={activePokemon}
          boss={boss}
          onAttack={handleAttack}
        />
      )}

      {/* Menu lateral para trocar pokémon */}
      <PokemonMenuLateral
        team={team}
        activePokemon={activePokemon}
        setActivePokemon={setActivePokemon}
      />
    </section>
  );
};

export default TeamBattleBox;
