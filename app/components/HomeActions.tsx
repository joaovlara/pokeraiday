"use client";

import Link from "next/link";
import Modal from "./Modal";
import { useState } from "react";
import { texts } from "@/utils/texts";

const HomeActions = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="flex flex-col justify-center items-center p-5 gap-5 text-start">
      <Link href={"/raid"} className="btn-primary">
        DESAFIAR
      </Link>

      <button
        className="btn-secondary"
        onClick={() => setShowModal(true)}
      >
        Como Jogar?
      </button>

      <p>{texts.home.tip}</p>

      {showModal && (
        <Modal onClose={() => setShowModal(false)} title={texts.home.howToPlayTitle}>
          <div className="space-y-2">
            {texts.home.howToPlayContent.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </Modal>
      )}
    </section>
  );
};

export default HomeActions;
