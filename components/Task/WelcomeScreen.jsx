import Image from "next/image";

export default function WelcomeScreen({ onGetStarted }) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row overflow-hidden touch-none">
      {/* Top/Left Section - Image container */}
      <div className="h-[45%] md:h-full md:w-1/2 relative overflow-hidden bg-black">
        <Image
          src="/images/bg.jpg"
          alt="Welcome"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain md:p-10"
        />
      </div>

      {/* Bottom/Right White Section */}
      <div className="flex-1 bg-white rounded-t-[3rem] md:rounded-t-0 md:rounded-l-[4rem] p-10 md:p-20 flex flex-col justify-between relative">
        {/* Grainy texture effect top left */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-20 pointer-events-none bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-size-[6px_6px]"></div>

        <div className="mt-4 md:mt-20 flex flex-col">
          <h1 className="text-[3.5rem] md:text-[6rem] font-bold leading-[1.1] text-zinc-950 tracking-tight">
            Manage <br />
            your <br />
            <div className="text-left">
              <span className="text-zinc-400">tasks</span>
            </div>
          </h1>
          <p className="mt-6 text-zinc-500 text-lg md:text-xl max-w-md hidden md:block">
            Simplify your workflow and boost productivity with our intuitive
            task management solution.
          </p>
        </div>

        <div className="md:max-w-md">
          <button
            onClick={onGetStarted}
            className="flex items-center justify-between w-full group transition-all"
          >
            <span className="text-xl md:text-3xl font-bold text-zinc-950">
              Get started
            </span>
            <div className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-zinc-950 flex items-center justify-center text-white transition-transform group-active:scale-95 group-hover:scale-105">
              <span className="text-2xl md:text-4xl">→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
