"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ModalResultProps = {
  winner: "player" | "boss";
  onClose: () => void;
};

const ModalResult: React.FC<ModalResultProps> = ({ winner, onClose }) => {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push("/"); // redireciona para a página inicial
  };

  return (
    <section className="fixed inset-0 flex items-center p-3 justify-center bg-black/70 z-50 text-center">
      <div className="relative bg-neutral-800 p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-white">
          {winner === "player" ? "Vitória!" : "Derrota!"}
        </h2>

        <div className="w-full">
          <a
            className="btn-secondary mt-6 w-full cursor-pointer"
            href="https://github.com/joaovlara/pokeraiday"
            target="_blank"
            rel="noopener noreferrer"
          >
            Conheça o projeto
          </a>

          <button
            className="btn-secondary mt-6 w-full cursor-pointer"
            onClick={handleClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </section>
  );
};

export default ModalResult;
