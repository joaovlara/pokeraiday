"use client";

import PokemonStats from "./PokemonStats";
import PokemonMenuLateral from "./PokemonMenuLateral";
import { PokemonEntity } from "@/entities/pokemon.entity";
import { BossEntity } from "@/entities/boss.entity";
import { useBattle } from "@/context/battle.context";

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
  const { performTurn } = useBattle();

  const handleAttack = (move: any, pokemon: PokemonEntity) => {
    if (!boss || !pokemon) return;
    performTurn(pokemon, move);
  };

  return (
    <section className="flex flex-row w-full pt-3">
      {activePokemon && (
        <PokemonStats
          pokemon={activePokemon}
          boss={boss}
          onAttack={handleAttack}
        />
      )}

      <PokemonMenuLateral
        team={team}
        activePokemon={activePokemon}
        setActivePokemon={setActivePokemon}
      />
    </section>
  );
};

export default TeamBattleBox;
