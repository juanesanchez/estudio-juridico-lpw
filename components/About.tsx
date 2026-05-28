import Image from "next/image";
import { SectionReveal } from "@/components/SectionReveal";

export function About() {
  return (
    <section id="estudio" className="scroll-mt-20 bg-porcelain py-16 text-ink sm:py-20">
      <div className="section-shell grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <SectionReveal>
          <h2 className="font-sans text-[clamp(2rem,3.3vw,3rem)] font-semibold leading-tight text-balance">
            El Estudio
          </h2>
          <div className="mt-3 h-px w-16 bg-gold" />
          <p className="mt-6 text-base leading-7 text-ink/72">
            El estudio acompaña a trabajadores frente a situaciones donde la respuesta de la ART
            resulta insuficiente, tardía o directamente negativa. Cada caso se aborda con orden
            documental, claridad en los pasos y una estrategia orientada a proteger derechos.
          </p>
          <p className="mt-4 text-base leading-7 text-ink/72">
            La prioridad es que la persona entienda dónde está parada: qué puede reclamar, qué
            documentación reunir y cuál es el camino más conveniente según el estado médico y legal
            del siniestro.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.12} className="relative">
          <div className="relative aspect-[5/3.6] overflow-hidden bg-coal shadow-[0_10px_26px_rgba(0,0,0,0.12)]">
            <Image
              src="/images/legal-office-art.png"
              alt="Detalle de oficina legal orientada a reclamos laborales"
              fill
              className="object-cover object-right"
              sizes="(min-width: 1024px) 48vw, 92vw"
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
