"use client";

import PokemonStats from "./PokemonStats";
import PokemonMenuLateral from "./PokemonMenuLateral";
import { PokemonEntity } from "@/entities/pokemon";
import { BossEntity } from "@/entities/boss";
import { calculateDamage } from "@/utils/damage";

interface TeamBattleBoxProps {
  team: PokemonEntity[];
  boss: BossEntity | null;
  activePokemon: PokemonEntity | null;
  setActivePokemon: (pokemon: PokemonEntity) => void;
  setLog: React.Dispatch<React.SetStateAction<string[]>>;
  setBoss: React.Dispatch<React.SetStateAction<BossEntity | null>>;
}

const TeamBattleBox = ({
  team,
  boss,
  activePokemon,
  setActivePokemon,
  setLog,
  setBoss,
}: TeamBattleBoxProps) => {
  const handleAttack = (move: any, pokemon: PokemonEntity) => {
    if (!boss) return;

    // calcula dano real
    const dano = calculateDamage(pokemon, boss, move);

    // atualiza HP do boss
    setBoss((prev) =>
      prev ? { ...prev, hp: Math.max(prev.hp - dano, 0) } : prev,
    );

    // adiciona mensagem no log
    setLog((prev) => [
      ...prev,
      `${pokemon.name} usou ${move.name} causando ${dano} de dano em ${boss.name}!`,
    ]);

    // aqui depois podemos chamar nextRound() do contexto para o boss atacar
  };

  return (
    <section className="flex flex-row w-full">
      {/* Stats do pokémon ativo */}
      {activePokemon && (
        <PokemonStats
          pokemon={activePokemon}
          boss={boss}
          onAttack={handleAttack} // conecta ataque
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
