// app/battle/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface Pokemon {
  name: string;
  sprites: { front_default: string };
  stats: { base_stat: number; stat: { name: string } }[];
  moves: { move: { name: string; url: string } }[];
}

function getStat(pokemon: Pokemon, stat: string) {
  return pokemon.stats.find((s) => s.stat.name === stat)?.base_stat || 0;
}

function pickRandomMoves(p: Pokemon, count = 4) {
  const unique = Array.from(new Set(p.moves.map((m) => m.move)));
  const shuffled = unique.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export default function Battle() {
  const searchParams = useSearchParams();
  const p1Name = searchParams.get("p1") || "";
  const p2Name = searchParams.get("p2") || "";
  const [p1, setP1] = useState<Pokemon | null>(null);
  const [p2, setP2] = useState<Pokemon | null>(null);
  const [hp1, setHp1] = useState<number | null>(null);
  const [hp2, setHp2] = useState<number | null>(null);
  const [moves1, setMoves1] = useState<{ name: string; url: string }[]>([]);
  const [moves2, setMoves2] = useState<{ name: string; url: string }[]>([]);
  const [winner, setWinner] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [lastAction, setLastAction] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [res1, res2] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${p1Name.toLowerCase()}`),
          fetch(`https://pokeapi.co/api/v2/pokemon/${p2Name.toLowerCase()}`),
        ]);
        if (!res1.ok || !res2.ok) {
          setLoading(false);
          return;
        }
        const data1 = await res1.json();
        const data2 = await res2.json();
        setP1(data1);
        setP2(data2);
        setHp1(data1.stats.find((s: any) => s.stat.name === "hp")?.base_stat || 0);
        setHp2(data2.stats.find((s: any) => s.stat.name === "hp")?.base_stat || 0);
        setMoves1(pickRandomMoves(data1));
        setMoves2(pickRandomMoves(data2));
        setWinner("");
        setLastAction("");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (p1Name && p2Name) fetchData();
  }, [p1Name, p2Name]);

  const fetchMovePower = async (moveUrl: string) => {
    try {
      const res = await fetch(moveUrl);
      if (!res.ok) return null;
      const data = await res.json();
      return data.power; // pode ser null
    } catch {
      return null;
    }
  };

  const attackWithMove = async (
    attacker: Pokemon,
    defender: Pokemon,
    setDefHp: (v: number) => void,
    defHp: number,
    move: { name: string; url: string },
  ) => {
    if (winner) return;
    // busca power do movimento
    const power = await fetchMovePower(move.url);
    const atk = getStat(attacker, "attack");
    const def = getStat(defender, "defense");

    // fórmula de dano simples e balanceada
    const basePower = power || 50;
    const baseDamage = Math.max(1, Math.floor(((basePower * atk) / (def + 20))));
    const randomFactor = Math.floor(Math.random() * Math.max(1, Math.floor(baseDamage * 0.25)));
    const damage = baseDamage + randomFactor;

    const newHp = Math.max(0, defHp - damage);
    setDefHp(newHp);
    setLastAction(`${attacker.name} usou ${move.name} e causou ${damage} de dano!`);
    if (newHp === 0) setWinner(attacker.name);
  };

  if (loading || !p1 || !p2 || hp1 === null || hp2 === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl bg-linear-to-br from-yellow-100 via-orange-150 to-red-200">
        Carregando batalha...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-linear-to-br from-yellow-100 via-orange-150 to-red-200 p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Batalha Pokémon</h1>

      <div className="w-full max-w-4xl bg-white/70 backdrop-blur rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between gap-6">
          {[p1, p2].map((poke, idx) => {
            const currentHp = idx === 0 ? hp1! : hp2!;
            const maxHp = getStat(poke!, "hp");
            const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
            const barColor = hpPercent > 50 ? "bg-green-500" : hpPercent > 20 ? "bg-yellow-400" : "bg-red-500";
            const moves = idx === 0 ? moves1 : moves2;

            return (
              <div
                key={poke!.name}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 flex-1 flex flex-col items-center transition-transform hover:scale-[1.02]"
              >
                <Image
                  src={poke!.sprites.front_default}
                  alt={poke!.name}
                  width={140}
                  height={140}
                  className="drop-shadow-lg"
                />
                <h2 className="text-2xl font-bold capitalize mt-2">{poke!.name}</h2>

                <div className="w-full mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">HP</span>
                    <span className="font-medium">{currentHp} / {maxHp}</span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-4 ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${hpPercent}%` }}
                    />
                  </div>
                </div>

                <ul className="mt-4 text-left w-full space-y-1">
                  {["attack", "defense", "speed"].map((stat) => (
                    <li key={stat} className="capitalize flex justify-between text-sm text-gray-700">
                      <span>{stat}</span>
                      <span className="font-medium">{getStat(poke!, stat)}</span>
                    </li>
                  ))}
                </ul>

                <div className="w-full mt-4">
                  <div className="text-sm text-gray-600 mb-2">Golpes</div>
                  <ul className="grid grid-cols-2 gap-2">
                    {moves.map((m) => (
                      <li key={m.name}>
                        <button
                          className="w-full bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm capitalize"
                          onClick={() =>
                            idx === 0
                              ? attackWithMove(p1!, p2!, setHp2 as any, hp2 as number, m)
                              : attackWithMove(p2!, p1!, setHp1 as any, hp1 as number, m)
                          }
                          disabled={!!winner || (idx === 0 ? hp1 === 0 : hp2 === 0)}
                        >
                          {m.name.replace("-", " ")}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          {lastAction && <div className="text-gray-800 italic">{lastAction}</div>}
          {winner && (
            <div className="mt-4 text-2xl font-bold text-green-700">
              {winner} venceu a batalha!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
