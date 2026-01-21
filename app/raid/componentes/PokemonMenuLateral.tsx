import Image from "next/image";

export default function PokemonMenuLateral() {
  const team = [
    { nome: "Talonflame", status: "active", sprite: "/images/sprite.png" },
    { nome: "Pancham", status: "fainted", sprite: "/images/sprite.png" },
    { nome: "sprite", status: "fainted", sprite: "/images/sprite.png" },
    { nome: "sprite", status: "reserve", sprite: "/images/sprite.png" },
    { nome: "sprite", status: "active", sprite: "/images/sprite.png" },
  ];

  const statusColors: Record<string, string> = {
    active: "bg-green-600",
    reserve: "bg-yellow-600",
    fainted: "bg-red-700 opacity-50",
  };

  return (
    <aside className="w-24 flex flex-col items-center space-y-4">
      {team.map((pkm, i) => (
        <div
          key={i}
          className={`w-16 h-16 rounded-full flex items-center justify-center ${statusColors[pkm.status]}`}
        >
          <img src={pkm.sprite} alt={pkm.nome} className="w-12 h-12" />
        </div>
      ))}
    </aside>
  );
}
