
import BossCard from "./componentes/BossCard";
import TeamBox from "./componentes/TeamBox";
import TeamBattleBox from "./componentes/TeamBattleBox";
import LogCombat from "./componentes/LogCombat";

const page = () => {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-3 w-screen p-5">
      <BossCard />
      <TeamBox />
      <TeamBattleBox />

    </main>
  );
};

export default page;
