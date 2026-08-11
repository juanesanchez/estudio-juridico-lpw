"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { firm, navItems } from "@/lib/site-data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full backdrop-blur-md transition-all duration-500 ${
        scrolled ? "bg-ink/75 shadow-[0_8px_24px_rgba(0,0,0,0.22)]" : "bg-ink/50"
      }`}
    >
      <nav className="section-shell flex h-16 items-center justify-between">
        <a href="#inicio" className="group flex items-center gap-3" aria-label="Volver al inicio">
          <span className="grid h-9 w-9 place-items-center border border-gold/45 bg-transparent font-sans text-sm font-bold text-gold transition-colors group-hover:bg-gold group-hover:text-ink">
            PW
          </span>
          <span className="hidden max-w-[230px] text-[15px] font-semibold leading-tight text-porcelain sm:block">
            {firm.name}
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              className="text-sm font-medium text-porcelain/78 transition-colors hover:text-gold"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={firm.whatsappHref}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("whatsapp_click", { location: "navbar" })}
            className="border border-gold bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft"
          >
            Consulta
          </a>
        </div>

        <button
          className="grid h-10 w-10 place-items-center border border-porcelain/18 text-porcelain lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Cerrar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      <div
        className={`section-shell overflow-hidden transition-all duration-500 lg:hidden ${
          open ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <div className="border border-porcelain/12 bg-ink/92 p-3 backdrop-blur-xl">
          {navItems.map((item) => (
            <a
              className="block px-3 py-3 text-sm text-porcelain/82"
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href={firm.whatsappHref}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("whatsapp_click", { location: "navbar-mobile" })}
            className="mt-2 block bg-gold px-4 py-3 text-center text-sm font-semibold text-ink"
          >
            Consulta
          </a>
        </div>
      </div>
    </header>
  );
}
