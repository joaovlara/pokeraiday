"use client";

import { useEffect, useState } from "react";
import BossCard from "./componentes/BossCard";
import TeamBox from "./componentes/TeamBox";
import TeamBattleBox from "./componentes/TeamBattleBox";
import LogCombat from "./componentes/LogCombat";
import { PokemonEntity } from "@/entities/pokemon.entity";
import { useBattle } from "@/context/battle.context";
import { createAttackers } from "@/actions/battle";
import ModalResult from "./componentes/ModalResult";
import { useRouter } from "next/navigation";

const RaidPage = () => {
  const router = useRouter();
  const { boss, team, logs, startBattle, winner } = useBattle();
  const [bossMaxHp, setBossMaxHp] = useState<number>(0);
  const [attackers, setAttackers] = useState<PokemonEntity[]>([]);
  const [loadingAttackers, setLoadingAttackers] = useState<boolean>(false);
  const [errorAttackers, setErrorAttackers] = useState<string | null>(null);

  const [battleStarted, setBattleStarted] = useState(false);
  const [activePokemon, setActivePokemon] = useState<PokemonEntity | null>(
    null,
  );

  useEffect(() => {
    if (!boss) {
      router.push("/");
    }
  }, [boss, router]);
  
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

  // Atualiza bossMaxHp apenas quando o boss é definido pela primeira vez
  useEffect(() => {
    if (boss && bossMaxHp === 0) {
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
    <main className="flex flex-col justify-center items-center gap-3 w-full p-5">
      <div>
        {boss && <BossCard boss={boss} bossMaxHp={bossMaxHp} />}

        {!battleStarted && (
          <TeamBox
            attackers={attackers}
            team={team}
            setTeam={() => {}}
            onStartBattle={handleStartBattle}
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

        <div>
          {" "}
          {/* resto da tela */}{" "}
          {winner && <ModalResult winner={winner} onClose={() => null} />}{" "}
        </div>
        {!battleStarted && loadingAttackers && (
          <p className="mt-4 text-muted">Gerando atacantes...</p>
        )}
        {!battleStarted && errorAttackers && (
          <p className="mt-4 text-danger">{errorAttackers}</p>
        )}
      </div>
    </main>
  );
};

export default RaidPage;
