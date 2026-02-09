"use client";

import Image from "next/image";
import TypeBadge from "./TypeBadge";
import { useBattle } from "@/context/battle.context";

const BossBox = () => {
  const { boss } = useBattle(); // pega o boss do contexto

  if (!boss) return <p>Carregando Boss...</p>;

  return (
    <section className="flex flex-col justify-center items-center gap-5 bg-radial-red p-5 rounded-lg">
      <h2 className="text-emphasis">DESAFIO DO DIA:</h2>

      <div className="flex flex-col items-center justify-center gap-1">
        <h3 className="boss-name uppercase">{boss.name}</h3>
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
