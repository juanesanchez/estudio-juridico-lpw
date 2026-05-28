import { SectionReveal } from "@/components/SectionReveal";
import { processSteps } from "@/lib/site-data";

export function Process() {
  return (
    <section className="bg-[#15130f] py-24 sm:py-32">
      <div className="section-shell">
        <SectionReveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-gold">Proceso</p>
          <h2 className="mt-5 font-display text-[clamp(2.3rem,5vw,4.9rem)] font-normal leading-none text-balance">
            Un recorrido claro desde la primera consulta.
          </h2>
        </SectionReveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-4">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <SectionReveal delay={index * 0.07} key={step.title}>
                <article className="relative h-full border border-porcelain/12 bg-porcelain/[0.03] p-7">
                  <div className="mb-10 flex items-center justify-between">
                    <span className="font-display text-5xl text-gold/55">0{index + 1}</span>
                    <span className="grid h-11 w-11 place-items-center border border-gold/35 text-gold">
                      <Icon size={20} />
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-normal">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-porcelain/62">{step.description}</p>
                </article>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
