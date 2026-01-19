// app/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { Pokemon } from "@/types/pokemon";
import { PokemonSelector } from "@/components/PokemonSelector";

export default function Home() {
  const router = useRouter();

  const handleSelectionComplete = (selected: Pokemon[]) => {
    if (selected.length === 2) {
      router.push(`/battle?p1=${selected[0].name}&p2=${selected[1].name}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-100 via-indigo-150 to-indigo-200 p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Pokémon Battle Simulator</h1>
      <PokemonSelector onSelectionComplete={handleSelectionComplete} />
    </div>
  );
}
