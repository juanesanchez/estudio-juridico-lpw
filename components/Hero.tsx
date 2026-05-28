"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot } from "lucide-react";
import Image from "next/image";

type HeroProps = {
  onOpenChat: () => void;
};

export function Hero({ onOpenChat }: HeroProps) {
  return (
    <section id="inicio" className="relative isolate flex min-h-[76vh] items-center overflow-hidden pt-32 lg:pt-36">
      <Image
        src="/images/legal-office-art.png"
        alt="Oficina jurídica con documentos legales y casco de seguridad"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.86)_48%,rgba(5,5,5,0.42)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink to-transparent" />

      <div className="section-shell relative z-10 grid min-h-[calc(76vh-144px)] items-center py-14">
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <h1 className="font-sans text-[clamp(2.25rem,4.5vw,4.4rem)] font-semibold leading-[1.05] text-balance text-porcelain">
            ¿Sufriste un accidente?
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-porcelain/76">
            Reclamá con nuestro equipo de abogados expertos. Las aseguradoras no siempre tienen la razón.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onOpenChat}
              className="group relative inline-flex items-center justify-center gap-3 bg-gold px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-gold-soft"
            >
              <Bot size={18} />
              <span className="flex flex-col items-start leading-tight">
                <span>Iniciá tu consulta</span>
                <span className="text-[10px] font-normal opacity-70">Asistente virtual · 2 min</span>
              </span>
            </button>
            <a
              href="#art"
              className="group inline-flex items-center justify-center gap-3 border border-porcelain/32 px-6 py-3.5 text-sm font-bold text-porcelain transition-colors hover:border-gold hover:text-gold"
            >
              Ver áreas de práctica
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
