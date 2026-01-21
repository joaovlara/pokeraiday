import Link from "next/link";
import Image from "next/image";

const TeamBox = () => {
  return (
    <div className="w-full">
      <h2 className="text-white text-xl font-bold mb-4 text-center">
        Escolha sua Equipe: 5/5
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center bg-neutral-900 border-stone-700 border-2 rounded-lg p-4"
          >
            <Image
              src="/images/sprite.png"
              alt={`Personagem ${i + 1}`}
              className="mb-2"
              height={50}
              width={50}
            />
            <span>Nome</span>
            <span>nivel</span>
          </div>
        ))}

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
