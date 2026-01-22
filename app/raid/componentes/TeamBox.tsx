"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const TeamBox = () => {
  // estado para armazenar quais cards estão selecionados
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (index: number) => {
    setSelected(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // desmarca se já estava selecionado
          : [...prev, index], // adiciona se não estava
    );
  };

  return (
    <div className="w-full">
      <div className="p-3">
        <h2 className="text-emphasis">
          Escolha sua Equipe: {selected.length}/5
        </h2>
      </div>

      {/* Grid de Card */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 8 }).map((_, i) => {
          const isSelected = selected.includes(i);
          return (
            <div
              key={i}
              onClick={() => toggleSelect(i)}
              className={`flex flex-col items-center justify-center bg-neutral-900 border-2 aspect-square rounded-lg p-4 cursor-pointer transition-colors ${
                isSelected
                  ? "border-green-500 bg-neutral-950"
                  : "border-stone-700"
              }`}
            >
              <Image
                src="/images/sprite.png"
                alt={`Personagem ${i + 1}`}
                className="mb-2"
                height={50}
                width={50}
              />
              <span className="name-pokemon">Nome</span>
              <p>nivel</p>
            </div>
          );
        })}

        <Link
          href={"/raid/battle"}
          className="flex items-center justify-center bg-red-900 hover:bg-red-700 text-white font-bold rounded-lg p-2 text-center"
        >
          Iniciar Batalha
        </Link>
      </div>
    </div>
  );
};

export default TeamBox;
