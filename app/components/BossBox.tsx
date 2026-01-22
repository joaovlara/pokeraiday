"use client";

import Image from "next/image";

const BossBox = () => {
  return (
    <section className="flex flex-col justify-center items-center gap-5 bg-radial-red">
      <h2 className="text-emphasis">DESAFIO DO DIA:</h2>

      <div className="flex flex-col items-center justify-center gap-1">
        <h3 className="boss-name">PIKACHU</h3>
        <p>Nivel: 100</p>
        <Image src="/images/sprite.png" alt="sprite" width={200} height={200} />
        <div className="flex">
          <Image
            src="/images/Electric_icon_SwSh.png"
            alt="sprite"
            width={50}
            height={50}
          />
          <Image
            src="/images/Normal_icon_SwSh.png"
            alt="sprite"
            width={50}
            height={50}
          />
        </div>
      </div>
    </section>
  );
};

export default BossBox;
