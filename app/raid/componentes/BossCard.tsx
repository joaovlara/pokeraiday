"use client";

import Image from "next/image";
import { BossEntity } from "@/entities/boss";
import { typeMap } from "@/utils/typeMap";

interface BossCardProps {
  boss: BossEntity;
}

const BossCard = ({ boss }: BossCardProps) => {
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
