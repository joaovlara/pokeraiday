import Image from "next/image";

const BossCard = () => {
  return (
    <section className="flex flex-col w-full">
      <div className="relative flex flex-col p-5 border-card w-full aspect-square bg-neutral-900 overflow-hidden">
        <h3 className="boss-name relative z-10">PIKACHU</h3>
        <p className="relative z-10">Nivel: 100</p>

        <Image
          src="/images/sprite.png"
          alt="sprite"
          fill
          className="object-contain"
        />
        <div className="absolute bottom-3 right-3 flex gap-2 z-10">
          <Image
            src="/images/Electric_icon_SwSh.png"
            alt="Electric type"
            width={50}
            height={50}
          />
          <Image
            src="/images/Normal_icon_SwSh.png"
            alt="Normal type"
            width={50}
            height={50}
          />
        </div>
      </div>
    </section>
  );
};

export default BossCard;
