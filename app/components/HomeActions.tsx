import Link from "next/link";

const HomeActions = () => {
  return (
    <section className="flex flex-col justify-center items-center p-5 gap-5 text-start">
      <Link href={"/raid"} className="btn-primary">DESAFIAR</Link>
      <button className="btn-secondary">Como Jogar?</button>

        <p>
          Dica: Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta
          mollitia, deserunt sint!
        </p>
    </section>
  );
};

export default HomeActions;
