"use client";

import { FormEvent, useState } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import { firm } from "@/lib/site-data";

type FormState = "idle" | "error" | "success";

export function Contact() {
  const [state, setState] = useState<FormState>("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const matter = String(form.get("matter") || "").trim();
    const message = String(form.get("message") || "").trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !validEmail || !message) {
      setState("error");
      return;
    }

    setState("success");
    const subject = encodeURIComponent(`Consulta ART - ${name}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || "-"}\nMateria: ${matter || "-"}\n\nConsulta:\n${message}`,
    );
    window.location.href = `${firm.emailHref}?subject=${subject}&body=${body}`;
    event.currentTarget.reset();
  }

  return (
    <section id="contacto" className="scroll-mt-20 bg-ink py-16 sm:py-20">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.86fr_1.14fr]">
        <SectionReveal>
          <h2 className="font-sans text-[clamp(2rem,3.3vw,3rem)] font-semibold leading-tight text-balance">
            Contacto
          </h2>
          <div className="mt-3 h-px w-16 bg-gold" />
          <p className="mt-5 max-w-xl text-base leading-7 text-porcelain/68">
            Contanos qué ocurrió, qué respuesta dio la ART y en qué estado se encuentra el
            tratamiento. El primer paso es ordenar la información.
          </p>

          <div className="mt-8 space-y-3">
            <a
              href={firm.addressHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 border-b border-porcelain/14 pb-3 text-porcelain/78 transition-colors hover:text-gold"
            >
              <MapPin size={18} />
              {firm.address}
            </a>
            <a
              href={firm.phoneHref}
              className="flex items-center gap-4 border-b border-porcelain/14 pb-3 text-porcelain/78 transition-colors hover:text-gold"
            >
              <Phone size={18} />
              {firm.phoneDisplay}
            </a>
            <a
              href={firm.emailHref}
              className="flex items-center gap-4 border-b border-porcelain/14 pb-3 text-porcelain/78 transition-colors hover:text-gold"
            >
              <Mail size={18} />
              {firm.email}
            </a>
            <a
              href={firm.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-gold px-5 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-gold-soft"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.12}>
          <form onSubmit={handleSubmit} className="border border-porcelain/16 bg-[#080808] p-6 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold text-gold">Nombre completo</span>
                <input
                  name="name"
                  className="mt-2 w-full border-0 border-b border-porcelain/28 bg-transparent px-0 py-3 text-base text-porcelain outline-none transition-colors placeholder:text-porcelain/30 focus:border-gold"
                  placeholder="Tu nombre"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gold">Correo electrónico</span>
                <input
                  name="email"
                  type="email"
                  className="mt-2 w-full border-0 border-b border-porcelain/28 bg-transparent px-0 py-3 text-base text-porcelain outline-none transition-colors placeholder:text-porcelain/30 focus:border-gold"
                  placeholder="nombre@email.com"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gold">Teléfono</span>
                <input
                  name="phone"
                  className="mt-2 w-full border-0 border-b border-porcelain/28 bg-transparent px-0 py-3 text-base text-porcelain outline-none transition-colors placeholder:text-porcelain/30 focus:border-gold"
                  placeholder="011..."
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gold">Materia</span>
                <select
                  name="matter"
                  className="mt-2 w-full border-0 border-b border-porcelain/28 bg-transparent px-0 py-3 text-base text-porcelain outline-none transition-colors focus:border-gold"
                  defaultValue=""
                >
                  <option value="" className="bg-ink">Seleccionar</option>
                  <option value="Accidente laboral" className="bg-ink">Accidente laboral</option>
                  <option value="Accidente in itinere" className="bg-ink">Accidente in itinere</option>
                  <option value="Reclamo ART" className="bg-ink">Reclamo ART</option>
                  <option value="Otra consulta" className="bg-ink">Otra consulta</option>
                </select>
              </label>
            </div>

            <label className="mt-6 block">
              <span className="text-xs font-bold text-gold">Mensaje</span>
              <textarea
                name="message"
                rows={6}
                className="mt-2 w-full resize-none border-0 border-b border-porcelain/28 bg-transparent px-0 py-3 text-base text-porcelain outline-none transition-colors placeholder:text-porcelain/30 focus:border-gold"
                placeholder="Contanos brevemente qué pasó y si la ART respondió."
              />
            </label>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="bg-gold px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-gold-soft"
              >
                Enviar consulta
              </button>
              {state === "error" && (
                <p className="text-sm leading-6 text-gold-soft">
                  Completá nombre, email válido y consulta para continuar.
                </p>
              )}
              {state === "success" && (
                <p className="text-sm leading-6 text-gold-soft">
                  Consulta preparada. También podés escribir por WhatsApp para respuesta directa.
                </p>
              )}
            </div>
          </form>
        </SectionReveal>
      </div>

      <div className="section-shell mt-16 sm:mt-20">
        <SectionReveal delay={0.18}>
          <a
            href={firm.addressHref}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col items-center gap-3 border border-porcelain/16 bg-[#080808] px-5 py-4 text-center transition-colors hover:border-gold/40 sm:flex-row sm:gap-4 sm:text-left"
          >
            <div className="flex-shrink-0">
              <div className="grid h-9 w-9 place-items-center border border-gold/40 bg-gold/10 text-gold transition-colors group-hover:bg-gold/20">
                <MapPin size={16} strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-porcelain/40">Ubicación</p>
              <p className="mt-0.5 text-sm font-semibold text-porcelain leading-snug">Mitre 1290, 1er piso</p>
              <p className="text-xs text-porcelain/55">Morón, Buenos Aires</p>
            </div>
            <span className="flex-shrink-0 flex items-center gap-1.5 border border-gold/50 px-4 py-2 text-xs font-semibold text-gold transition-colors group-hover:bg-gold group-hover:text-ink">
              Cómo llegar
              <MapPin size={11} />
            </span>
          </a>
        </SectionReveal>
      </div>
    </section>
  );
}
