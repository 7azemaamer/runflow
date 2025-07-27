import Link from "next/link";

export default function Landing() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center  text-teal-600 px-6">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">
        Build, Connect, Automate
      </h1>
      <p className="text-lg sm:text-xl max-w-xl text-slate-400 mb-8">
        Drag, drop, and create workflows visually — like magic. This is your
        playground for automation, powered by React Flow, Zustand, and OpenAI.
      </p>
      <button className="cursor-pointer bg-teal-100 hover:brightness-75 px-6 py-3 rounded-full text-lg font-medium shadow-md transition-all">
        <Link href={"/workflows"}>Get Started</Link>
      </button>
    </section>
  );
}
