"use client";

import { useEffect } from "react";
import BossBox from "./components/BossBox";
import HomeActions from "./components/HomeActions";
import { useBattle } from "@/context/battle.context";
import { createBoss } from "@/actions/battle";

const Page = () => {
  const { boss, startBattle } = useBattle();

  useEffect(() => {
    const initBoss = async () => {
      if (!boss) {
        const bossEntity = await createBoss();
        startBattle(bossEntity, []);
      }
    };
    initBoss();
  }, [boss, startBattle]);

  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen gap-10 p-3">
      <BossBox />
      <HomeActions />
    </main>
  );
};

export default Page;
