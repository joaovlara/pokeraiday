"use client";

import PokemonStats from "./PokemonStats";
import PokemonMenuLateral from "./PokemonMenuLateral";
import { PokemonEntity } from "@/entities/pokemon";
import { BossEntity } from "@/entities/boss";

interface TeamBattleBoxProps {
  team: PokemonEntity[];
  boss: BossEntity | null;
  activePokemon: PokemonEntity | null;
  setActivePokemon: (pokemon: PokemonEntity) => void;
}

const TeamBattleBox = ({ team, boss, activePokemon, setActivePokemon }: TeamBattleBoxProps) => {
  return (
    <section className="flex flex-row w-full">
      {/* Stats do pokémon ativo */}
      {activePokemon && <PokemonStats pokemon={activePokemon} boss={boss} />}

      {/* Menu lateral para trocar pokémon */}
      <PokemonMenuLateral team={team} activePokemon={activePokemon} setActivePokemon={setActivePokemon} />
    </section>
  );
};

export default TeamBattleBox;
