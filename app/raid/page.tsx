import BossCard from "./componentes/BossCard";
import TeamBox from "./componentes/TeamBox";
import TeamBattleBox from "./componentes/TeamBattleBox";
import LogCombat from "./componentes/LogCombat";

const page = () => {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-3 w-full p-5">
      <div className="w-full max-w-2xl flex flex-col items-center gap-3">
        <BossCard />
        <TeamBox />
        <TeamBattleBox />
      </div>
    </main>
  );
};

export default page;
