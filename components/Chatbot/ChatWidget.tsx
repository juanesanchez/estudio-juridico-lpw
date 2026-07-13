"use client";

import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { Scale, X } from "lucide-react";
import { ChatWindow } from "./ChatWindow";

type ChatWidgetProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export function ChatWidget({ isOpen, setIsOpen }: ChatWidgetProps) {
  const bounceControls = useAnimation();

  useEffect(() => {
    if (isOpen) return;

    const t1 = setTimeout(() => {
      bounceControls.start({ y: [0, -14, 0, -7, 0], transition: { duration: 0.55, ease: "easeInOut" } });
    }, 3000);

    const t2 = setTimeout(() => {
      bounceControls.start({ y: [0, -10, 0, -5, 0], transition: { duration: 0.45, ease: "easeInOut" } });
    }, 4800);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isOpen, bounceControls]);

  return (
    <>
      {/* Ventana del chat — se desmonta al cerrar, reseteando el estado interno */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-4 left-2 right-2 z-50 flex h-[calc(100dvh-2rem)] flex-col overflow-hidden border border-porcelain/10 shadow-lift sm:left-auto sm:right-4 sm:h-[540px] sm:w-96"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 z-10 text-porcelain/60 transition-colors hover:text-porcelain"
              aria-label="Cerrar chat"
            >
              <X size={16} />
            </button>
            <ChatWindow />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante — oculto cuando el chat está abierto */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="chat-button"
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
          >
            <motion.div animate={bounceControls} className="flex flex-col items-end gap-2">
              {/* Callout */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="rounded-lg border border-porcelain/10 bg-coal px-3 py-1.5 text-xs text-porcelain/70 shadow-lg"
              >
                ⚡ Completá el formulario en menos de 2 min
              </motion.p>

              {/* Botón con indicador de actividad */}
              <div className="relative">
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-ink bg-gold" />
                </span>
                <button
                  onClick={() => setIsOpen(true)}
                  aria-label="Abrir chat de consulta"
                  className="flex items-center gap-2.5 rounded-full bg-gold px-5 py-3.5 text-sm font-bold text-ink shadow-[0_4px_20px_rgba(185,154,91,0.5)] transition-colors hover:bg-gold-soft"
                >
                  <Scale size={18} />
                  Abogado on-line
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
