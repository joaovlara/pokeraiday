import Link from "next/link";

const HomeActions = () => {
  return (
    <section className="flex flex-col gap-5 justify-center items-center p-5 text-start">
      <Link 
      href={"/raid"}
      className="bg-red-900 p-4 w-50 rounded-2xl font-bold text-center">
        DESAFIAR
      </Link>

      <p>
        Dica: Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta
        mollitia, deserunt sint!
      </p>
      <p>Como jogar?</p>
    </section>
  );
};

export default HomeActions;
