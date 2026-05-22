"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { ChatWindow } from "./ChatWindow";

type ChatWidgetProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export function ChatWidget({ isOpen, setIsOpen }: ChatWidgetProps) {
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
            className="fixed bottom-20 right-4 z-50 flex h-[520px] w-80 flex-col overflow-hidden border border-porcelain/10 shadow-lift"
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
          <motion.button
            key="chat-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-gold px-4 py-3 text-sm font-semibold text-ink shadow-[0_4px_16px_rgba(185,154,91,0.4)] transition-colors hover:bg-gold-soft"
            aria-label="Abrir chat de consulta"
          >
            <MessageCircle size={18} />
            Consultar
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
