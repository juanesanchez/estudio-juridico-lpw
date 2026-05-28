import { firm, navItems } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="border-t border-porcelain/12 bg-ink py-10">
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
    </footer>
  );
}
