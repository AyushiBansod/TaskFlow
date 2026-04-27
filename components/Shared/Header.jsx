"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiTask } from "react-icons/si";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/home" },
    { name: "Task", href: "/task" },
    { name: "Challenges", href: "/challenges" },
  ];

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#1a1a1a] text-white sticky top-0 z-50">
      <div className="w-full px-5 md:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/home" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white text-zinc-950 flex items-center justify-center">
              <SiTask className="text-zinc-950" />
            </div>
            <div className="font-semibold tracking-tight uppercase text-sm hidden sm:block">
              Task Flow
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 items-center justify-center gap-10 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={handleNavClick}
              className={`transition relative py-1 ${
                pathname === link.href
                  ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/task"
            className="hidden md:flex h-10 rounded-md bg-[#333333] px-4 text-xs font-semibold text-white hover:bg-[#444444] transition shadow-sm items-center justify-center whitespace-nowrap"
          >
            Get Started — It&apos;s Free
          </Link>

          <button
            type="button"
            aria-label="Toggle Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden h-10 w-10 flex flex-col items-center justify-center gap-2 transition-all z-50 relative"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-transform ${isMenuOpen ? "rotate-45 translate-y-1.25" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-transform ${isMenuOpen ? "-rotate-45 -translate-y-1.25" : ""}`}
            ></span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/60 md:hidden flex items-start justify-center pt-24 px-6 animate-in fade-in duration-300 backdrop-blur-sm">
            <div className="w-full bg-[#1a1a1a] rounded-[2.5rem] p-10 flex flex-col gap-6 shadow-2xl border border-white/10 animate-in slide-in-from-top-8 duration-500">
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={handleNavClick}
                    className={`text-2xl font-serif font-medium text-left transition ${
                      pathname === link.href ? "text-white" : "text-white/40"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <Link
                href="/task"
                onClick={handleNavClick}
                className="mt-4 w-full h-16 rounded-full bg-[#333333] text-white text-lg font-serif font-semibold tracking-wide uppercase hover:bg-[#444444] transition shadow-md border border-white/5 flex items-center justify-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
