"use client";

import PokemonStats from "./PokemonStats";
import PokemonMenuLateral from "./PokemonMenuLateral";
import { PokemonEntity } from "@/entities/pokemon";
import { BossEntity } from "@/entities/boss";

interface Attack {
  nome: string;
  dano: number | string;
  usos: string;
  tipo: string;
}

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
  const handleAttack = (attack: Attack, pokemon: PokemonEntity) => {
    if (!boss) return;

    const dano = typeof attack.dano === "number" ? attack.dano : 0;

    // Atualiza HP do boss
    setBoss((prev) =>
      prev ? { ...prev, hp: Math.max(prev.hp - dano, 0) } : prev,
    );

    // Adiciona mensagem no log
    setLog((prev) => [
      ...prev,
      `${pokemon.name} usou ${attack.nome} causando ${dano} de dano em ${boss.name}!`,
    ]);
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
