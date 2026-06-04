import Image from "next/image";
import { firm, navItems } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="bg-ink">
      <div className="border-t border-porcelain/12 py-10">
        <div className="section-shell flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-2xl text-porcelain">{firm.name}</p>
            <p className="mt-2 text-sm text-porcelain/48">
              Accidentes laborales, enfermedades profesionales y reclamos ART.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-porcelain/58 transition-colors hover:text-gold">
                {item.label}
              </a>
            ))}
          </div>
          <p className="text-sm text-porcelain/42">
            © {new Date().getFullYear()} {firm.shortName}
          </p>
        </div>
      </div>
      <div className="border-t border-porcelain/10 py-5">
        <div className="section-shell flex items-center justify-center gap-3">
          <span className="text-[10px] uppercase tracking-widest text-porcelain/50">
            Desarrollado por
          </span>
          <span className="text-porcelain/20 select-none">|</span>
          <a
            href="https://westdigital.com.ar/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 opacity-60 transition-opacity hover:opacity-90"
          >
            <Image
              src="/images/west_logo.png"
              alt="West Digital"
              width={72}
              height={30}
            />
            <span className="text-sm font-semibold tracking-wide text-porcelain">
              West Digital
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
