"use client";

import { useEffect, useState } from "react";
import BossCard from "./componentes/BossCard";
import TeamBox from "./componentes/TeamBox";
import TeamBattleBox from "./componentes/TeamBattleBox";
import LogCombat from "./componentes/LogCombat";
import { BossEntity } from "@/entities/boss";
import { PokemonEntity } from "@/entities/pokemon";
import { createBoss } from "@/actions/battle";
import { createAttackers } from "@/actions/team";

const RaidPage = () => {
  const [boss, setBoss] = useState<BossEntity | null>(null);
  const [bossMaxHp, setBossMaxHp] = useState<number>(0);
  const [attackers, setAttackers] = useState<PokemonEntity[]>([]);
  const [team, setTeam] = useState<PokemonEntity[]>([]);
  const [battleStarted, setBattleStarted] = useState(false);
  const [activePokemon, setActivePokemon] = useState<PokemonEntity | null>(
    null,
  );
  const [log, setLog] = useState<string[]>([]);

  // Sorteia boss e pokémons ao carregar
  useEffect(() => {
    const init = async () => {
      const bossData = await createBoss();
      const attackersData = await createAttackers();
      setBoss(bossData);
      setBossMaxHp(bossData.hp);
      setAttackers(attackersData);
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
          setLog={setLog} // adiciona aqui
          setBoss={setBoss} // adiciona aqui
        />
      )}

      {battleStarted && <LogCombat log={log} />}
    </main>
  );
};

export default RaidPage;
