"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-100 via-indigo-150 to-indigo-200 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">Pokémon Raid Battle</h1>
        <p className="text-lg text-gray-700 mb-8">Enfrente um boss e forme uma equipe para derrotá-lo!</p>
        <button
          onClick={() => router.push("/raid/setup")}
          className="px-8 py-4 rounded-lg bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition"
        >
          Iniciar Raid
        </button>
      </div>
    </div>
  );
}
