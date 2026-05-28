import Image from "next/image";
import { UserRound } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import { team } from "@/lib/site-data";

export function Team() {
  return (
    <section id="equipo" className="scroll-mt-20 bg-porcelain py-16 text-ink sm:py-20">
      <div className="section-shell">
        <SectionReveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-sans text-[clamp(2rem,3.3vw,3rem)] font-semibold leading-tight text-balance">
            Stand de Abogados
          </h2>
          <div className="mx-auto mt-3 h-px w-16 bg-gold" />
          <p className="mt-5 text-base leading-7 text-ink/66">
            Un equipo orientado a resolver consultas de trabajadores con seguimiento cercano,
            documentación ordenada y comunicación directa.
          </p>
        </SectionReveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {team.map((member, index) => {
            const Icon = member.icon;
            return (
              <SectionReveal delay={index * 0.08} key={member.name}>
                <article className="h-full border border-ink/10 bg-white shadow-[0_8px_22px_rgba(0,0,0,0.04)]">
                  {member.hasPhoto && (
                    <div className="w-full border-b border-ink/10">
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          width={0}
                          height={0}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="h-auto w-full"
                        />
                      ) : (
                        <div className="flex h-52 w-full items-center justify-center bg-ink/5">
                          <div className="flex flex-col items-center gap-2 text-ink/25">
                            <UserRound size={56} strokeWidth={1.2} />
                            <span className="text-xs tracking-widest uppercase">Foto</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    {!member.hasPhoto && (
                      <div className="grid h-12 w-12 place-items-center border border-gold/40 bg-ink text-gold">
                        <Icon size={22} />
                      </div>
                    )}
                    <h3 className={`text-2xl font-semibold leading-tight ${member.hasPhoto ? "" : "mt-6"}`}>
                      {member.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-gold">{member.role}</p>
                    <p className="mt-4 text-sm leading-6 text-ink/64">{member.description}</p>
                  </div>
                </article>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
