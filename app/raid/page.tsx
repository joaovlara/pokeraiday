
import BossCard from "./componentes/BossCard";
import TeamBox from "./componentes/TeamBox";
import TeamBattleBox from "./componentes/TeamBattleBox";

const page = () => {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen w-screen gap-10 p-5">
      <BossCard />
      <TeamBox />
      <TeamBattleBox />
    </main>
  );
};

export default page;
