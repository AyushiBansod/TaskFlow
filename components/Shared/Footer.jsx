import { SiTask } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1a1a1a] text-white border-t border-white/5">
      <div className="w-full px-5 md:px-10 py-6 sm:h-20 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-white text-zinc-950 flex items-center justify-center">
            <SiTask className="text-zinc-950" />
          </div>
          <div className="font-semibold tracking-tight uppercase text-sm text-white">
            Task Flow
          </div>
        </div>
        <div className="text-xs text-white text-center sm:text-right">
          © {new Date().getFullYear()} Task Flow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
