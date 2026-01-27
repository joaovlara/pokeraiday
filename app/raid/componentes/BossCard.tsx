"use client";

import Image from "next/image";
import { BossEntity } from "@/entities/boss";
import { typeMap } from "@/utils/typeMap";
import HealthBar from "./HealthBar";

interface BossCardProps {
  boss: BossEntity;
  bossMaxHp: number; // novo: valor máximo inicial
}

const BossCard = ({ boss, bossMaxHp }: BossCardProps) => {
  return (
    <section className="flex flex-col w-full">
      <div className="relative flex flex-col p-5 border-card w-full aspect-square bg-neutral-900 overflow-hidden">
        <h3 className="boss-name relative z-10">{boss.name}</h3>
        <p className="relative z-10">Nível: {boss.level}</p>

        {boss.sprite && (
          <Image
            src={boss.sprite}
            alt={boss.name}
            fill
            className="object-contain"
          />
        )}

        {/* Barra de vida */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <HealthBar current={boss.hp} max={bossMaxHp} />
        </div>

        <div className="absolute bottom-3 right-3 flex gap-2 z-10">
          {boss.types.map((type) => {
            const typeData = typeMap[type];
            return (
              <Image
                key={type}
                src={typeData.icon}
                alt={`${type} type`}
                width={50}
                height={50}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BossCard;
