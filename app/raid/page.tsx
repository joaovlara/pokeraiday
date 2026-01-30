"use client";

import { useEffect, useState } from "react";
import BossCard from "./componentes/BossCard";
import TeamBox from "./componentes/TeamBox";
import TeamBattleBox from "./componentes/TeamBattleBox";
import LogCombat from "./componentes/LogCombat";
import { PokemonEntity } from "@/entities/pokemon.entity";
import { useBattle } from "@/context/battle.context";
import { createAttackers } from "@/actions/battle";

const RaidPage = () => {
  const { boss, team, logs, startBattle, winner } = useBattle();
  const [bossMaxHp, setBossMaxHp] = useState<number>(0);
  const [attackers, setAttackers] = useState<PokemonEntity[]>([]);
  const [loadingAttackers, setLoadingAttackers] = useState<boolean>(false);
  const [errorAttackers, setErrorAttackers] = useState<string | null>(null);

  const [battleStarted, setBattleStarted] = useState(false);
  const [activePokemon, setActivePokemon] = useState<PokemonEntity | null>(
    null,
  );

  // Criar atacantes apenas uma vez ao montar a página
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoadingAttackers(true);
      setErrorAttackers(null);
      try {
        const attackersData = await createAttackers();
        if (!mounted) return;
        setAttackers(attackersData);
      } catch (err) {
        console.error("createAttackers error:", err);
        if (!mounted) return;
        setErrorAttackers("Falha ao gerar atacantes. Tente novamente.");
      } finally {
        if (!mounted) return;
        setLoadingAttackers(false);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []); // roda só no mount

  // Atualiza bossMaxHp quando o boss do contexto for definido/alterado
  useEffect(() => {
    if (boss) {
      setBossMaxHp(boss.hp);
    }
  }, [boss]);

  // Define pokémon ativo quando a batalha começa e o time estiver disponível
  useEffect(() => {
    if (battleStarted && team.length > 0) {
      setActivePokemon(team[0]);
    }
  }, [battleStarted, team]);

  const handleStartBattle = () => {
    if (!boss) return;
    if (loadingAttackers) return; // evita iniciar antes de pronto
    if (errorAttackers) return; // opcional: bloquear se houve erro
    startBattle(boss, attackers);
    setBattleStarted(true);
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-3 w-full p-5">
      {boss && <BossCard boss={boss} bossMaxHp={bossMaxHp} />}

      {!battleStarted && (
        <TeamBox
          attackers={attackers}
          team={team}
          setTeam={() => {}}
          onStartBattle={handleStartBattle}
          // opcional: passe loadingAttackers e errorAttackers para TeamBox para UX
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

      {battleStarted && (
        <LogCombat
          log={logs.map(
            (l) =>
              `${l.actor} usou ${l.move} em ${l.target} causando ${l.damage} de dano (HP restante: ${l.remainingHP})`,
          )}
        />
      )}

      {winner && (
        <p className="text-emphasis mt-4">
          Fim da batalha! Vencedor: {winner === "player" ? "Jogador" : "Boss"}
        </p>
      )}

      {!battleStarted && loadingAttackers && (
        <p className="mt-4 text-muted">Gerando atacantes...</p>
      )}
      {!battleStarted && errorAttackers && (
        <p className="mt-4 text-danger">{errorAttackers}</p>
      )}
    </main>
  );
};

export default RaidPage;
