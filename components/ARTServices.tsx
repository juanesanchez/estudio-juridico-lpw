"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import { practiceAreas } from "@/lib/site-data";

export function ARTServices() {
  return (
    <section id="art" className="scroll-mt-20 bg-ink py-16 sm:py-20">
      <div className="section-shell">
        <SectionReveal className="mx-auto max-w-3xl text-center">
          <div>
            <h2 className="font-sans text-[clamp(2rem,3.3vw,3.2rem)] font-semibold leading-tight text-balance">
              Áreas de práctica
            </h2>
            <div className="mx-auto mt-3 h-px w-16 bg-gold" />
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-porcelain/66">
            Representación legal especializada en accidentes de tránsito y reclamaciones laborales.
            Te acompañamos desde la primera consulta hasta la resolución de tu caso.
          </p>
        </SectionReveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {practiceAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <motion.article
                key={area.title}
                className={`relative border p-8 transition-colors ${
                  area.primary
                    ? "border-gold/45 bg-[#0c0b08] hover:border-gold/70"
                    : "border-porcelain/18 bg-[#090909] hover:border-gold/30 hover:bg-[#0c0c0c]"
                }`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 flex-shrink-0 place-items-center border border-gold/40 bg-gold/10 text-gold">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-2xl font-semibold leading-tight text-porcelain">{area.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-porcelain/64">{area.description}</p>
                <ul className="mt-5 space-y-2">
                  {area.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-porcelain/80">
                      <Check size={14} className="mt-0.5 flex-shrink-0 text-gold" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>

        <SectionReveal className="mt-8 border border-porcelain/10 bg-[#090909] px-6 py-5 text-center">
          <p className="text-xs uppercase tracking-widest text-porcelain/40">
            Experiencia · Compromiso · Resultados
          </p>
          <p className="mt-2 text-lg font-semibold text-gold">
            No estás solo, estamos para ayudarte.
          </p>
          <p className="mt-1 text-sm text-porcelain/50">Atención personalizada en cada caso.</p>
        </SectionReveal>
      </div>
    </section>
  );
}
