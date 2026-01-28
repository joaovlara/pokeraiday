"use client";

import { useEffect, useState } from "react";
import BossCard from "./componentes/BossCard";
import TeamBox from "./componentes/TeamBox";
import TeamBattleBox from "./componentes/TeamBattleBox";
import LogCombat from "./componentes/LogCombat";
import { PokemonEntity } from "@/entities/pokemon";
import { createAttackers } from "@/actions/team";
import { useBattle } from "@/context/battle.context";

const RaidPage = () => {
  const { boss, logs } = useBattle(); // pega boss e logs do contexto
  const [bossMaxHp, setBossMaxHp] = useState<number>(0);
  const [attackers, setAttackers] = useState<PokemonEntity[]>([]);
  const [team, setTeam] = useState<PokemonEntity[]>([]);
  const [battleStarted, setBattleStarted] = useState(false);
  const [activePokemon, setActivePokemon] = useState<PokemonEntity | null>(null);

  // Sorteia os atacantes apenas uma vez ao carregar a página
  useEffect(() => {
    const init = async () => {
      const attackersData = await createAttackers();
      setAttackers(attackersData);

      if (boss) {
        setBossMaxHp(boss.hp); // usa o hp inicial do boss global
      }
    };
    init();
  }, []);

  // Quando a batalha começa, define o primeiro pokémon ativo
  useEffect(() => {
    if (battleStarted && team.length > 0) {
      setActivePokemon(team[0]);
    }
  }, [battleStarted, team]);

  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-3 w-full p-5">
      {boss && <BossCard boss={boss} bossMaxHp={bossMaxHp} />}

      {!battleStarted && (
        <TeamBox
          attackers={attackers}
          team={team}
          setTeam={setTeam}
          onStartBattle={() => setBattleStarted(true)}
        />
      )}

      {battleStarted && boss && (
        <TeamBattleBox
          team={team}
          boss={boss}
          activePokemon={activePokemon}
          setActivePokemon={setActivePokemon}
        />
      )}

      {battleStarted && <LogCombat log={logs.map(
        l => `${l.actor} usou ${l.move} em ${l.target} causando ${l.damage} de dano (HP restante: ${l.remainingHP})`
      )} />}
    </main>
  );
};

export default RaidPage;
