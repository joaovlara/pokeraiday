"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchRandomPokemon } from "@/services/pokeapi";
import { BossEntity, toBossEntity } from "@/entities/boss";
import TypeBadge from "./TypeBadge";

const BossBox = () => {
  const [boss, setBoss] = useState<BossEntity | null>(null);

  useEffect(() => {
    const loadBoss = async () => {
      const apiData = await fetchRandomPokemon();
      const bossEntity = toBossEntity(apiData);
      setBoss(bossEntity);
    };
    loadBoss();
  }, []);

  if (!boss) return <p>Carregando Boss...</p>;

  return (
    <section className="flex flex-col justify-center items-center gap-5 bg-radial-red">
      <h2 className="text-emphasis">DESAFIO DO DIA:</h2>

      <div className="flex flex-col items-center justify-center gap-1">
        <h3 className="boss-name">{boss.name}</h3>
        <p>Nível: {boss.level}</p>
        {boss.sprite && (
          <Image src={boss.sprite} alt={boss.name} width={200} height={200} />
        )}
        <div className="flex gap-2">
          {boss.types.map((type: string) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BossBox;
