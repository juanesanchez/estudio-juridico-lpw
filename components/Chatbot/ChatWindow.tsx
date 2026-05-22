"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { chatTree } from "@/lib/chat-tree";
import type { ChatNode } from "@/lib/chat-tree";
import { LexAvatar } from "./LexAvatar";

type HistoryItem = { q: string; a: string };
type Phase = "tree" | "form" | "done";
type FormData = { name: string; phone: string; desc: string };

const WHATSAPP_NUMBER = "5491168063420";

function buildWhatsAppMessage(history: HistoryItem[], form: FormData): string {
  const lines = [
    "Hola, completé el formulario del sitio web.",
    "",
    ...history.map((item) => `📋 ${item.q}: ${item.a}`),
    "",
    `👤 Nombre: ${form.name}`,
    `📞 Teléfono: ${form.phone}`,
    `📝 Descripción: ${form.desc}`,
  ];
  return lines.join("\n");
}

function LexBubble({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-gold">
        <LexAvatar size={14} />
      </div>
      <div className="max-w-[80%] rounded-r-lg rounded-bl-lg bg-ink px-3 py-2 text-xs leading-5 text-porcelain">
        {message}
      </div>
    </div>
  );
}

function UserBubble({ message }: { message: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-l-lg rounded-br-lg bg-gold/20 px-3 py-2 text-xs leading-5 text-porcelain/90">
        {message}
      </div>
    </div>
  );
}

export function ChatWindow() {
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [phase, setPhase] = useState<Phase>("tree");
  const [formData, setFormData] = useState<FormData>({ name: "", phone: "", desc: "" });
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentNode: ChatNode = chatTree[currentNodeId];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, phase]);

  function handleOption(optionText: string, nextId: string) {
    setHistory((prev) => [...prev, { q: currentNode.message, a: optionText }]);
    if (nextId === "form") {
      setPhase("form");
    } else {
      setCurrentNodeId(nextId);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = buildWhatsAppMessage(history, formData);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setPhase("done");
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center gap-3 bg-ink px-4 py-3">
        <div className="relative flex-shrink-0">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gold">
            <LexAvatar size={22} />
          </div>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-ink bg-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-porcelain">Lex — Asistente Legal</p>
          <p className="text-xs text-gold">En línea · Primera consulta gratis</p>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-coal p-4">
        {history.map((item, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <LexBubble message={item.q} />
            <UserBubble message={item.a} />
          </div>
        ))}

        <AnimatePresence mode="wait">
          {phase === "tree" && (
            <motion.div
              key={currentNodeId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-2"
            >
              <LexBubble message={currentNode.message} />
              <div className="flex flex-col gap-1.5 pl-8">
                {currentNode.options.map((opt) => (
                  <button
                    key={opt.text}
                    onClick={() => handleOption(opt.text, opt.nextId)}
                    className="border border-gold/40 px-3 py-2 text-left text-xs text-porcelain/90 transition-colors hover:border-gold hover:bg-gold/10"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === "form" && (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-2"
            >
              <LexBubble message="Casi listo. Completá tus datos para que el equipo pueda contactarte." />
              <div className="flex flex-col gap-2 pl-8">
                <input
                  required
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                  className="border border-porcelain/15 bg-ink/60 px-3 py-2 text-xs text-porcelain placeholder-porcelain/40 outline-none focus:border-gold"
                />
                <input
                  required
                  placeholder="Tu teléfono"
                  value={formData.phone}
                  onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                  className="border border-porcelain/15 bg-ink/60 px-3 py-2 text-xs text-porcelain placeholder-porcelain/40 outline-none focus:border-gold"
                />
                <textarea
                  required
                  rows={3}
                  placeholder="Contanos brevemente tu situación..."
                  value={formData.desc}
                  onChange={(e) => setFormData((f) => ({ ...f, desc: e.target.value }))}
                  className="resize-none border border-porcelain/15 bg-ink/60 px-3 py-2 text-xs text-porcelain placeholder-porcelain/40 outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  className="bg-gold px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft"
                >
                  Enviar por WhatsApp
                </button>
              </div>
            </motion.form>
          )}

          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
            >
              <LexBubble message="¡Listo! Te redirigimos a WhatsApp. El equipo te responderá a la brevedad. 🎉" />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
