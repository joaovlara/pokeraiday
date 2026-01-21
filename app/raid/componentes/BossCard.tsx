import React from "react";
import Image from "next/image";

const BossCard = () => {
  return (
    <section className="flex flex-col gap-5 w-full">
      <div className="flex flex-col p-5 border-card w-full">
        <h3>PIKACHU</h3>
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

export default BossCard;
