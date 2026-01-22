"use client";

import Header from "./components/Header";
import BossBox from "./components/BossBox";
import HomeActions from "./components/HomeActions";

const page = () => {
  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen gap-10 p-3">
      {/* <Header /> */}
      <BossBox />
      <HomeActions />
    </main>
  );
};

export default page;
