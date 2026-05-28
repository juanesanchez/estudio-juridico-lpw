# Chatbot Árbol de Decisiones — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar un chatbot de árbol de decisiones al sitio del estudio jurídico que guía al usuario por preguntas genéricas y al finalizar envía las respuestas + datos de contacto a WhatsApp.

**Architecture:** El estado `isOpen` vive en `ChatbotWrapper` (client component) que envuelve a `Hero` y `ChatWidget`. El árbol de decisiones es un objeto tipado en `lib/chat-tree.ts` separado de toda lógica. `ChatWindow` recorre el árbol con estado local y construye el mensaje de WhatsApp al finalizar.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS, framer-motion (ya instalado), lucide-react (ya instalado), TypeScript.

---

## Mapa de archivos

| Archivo | Acción | Responsabilidad |
|---------|--------|-----------------|
| `lib/chat-tree.ts` | Crear | Tipos + datos del árbol (sin lógica) |
| `components/Chatbot/LexAvatar.tsx` | Crear | SVG del avatar robot-balanza |
| `components/Chatbot/ChatWindow.tsx` | Crear | Lógica del chat: árbol → formulario → WhatsApp |
| `components/Chatbot/ChatWidget.tsx` | Crear | Botón flotante + ventana animada |
| `components/Chatbot/ChatbotWrapper.tsx` | Crear | Client wrapper con estado `isOpen` |
| `components/Hero.tsx` | Modificar | Recibe `onOpenChat` prop, CTA abre el chat |
| `app/page.tsx` | Modificar | Reemplaza `<Hero />` con `<ChatbotWrapper />` |

---

## Task 1: Árbol de decisiones (`lib/chat-tree.ts`)

**Files:**
- Create: `lib/chat-tree.ts`

- [ ] **Crear `lib/chat-tree.ts`** con los tipos y el árbol genérico:

```ts
export type ChatOption = {
  text: string;
  nextId: string;
};

export type ChatNode = {
  id: string;
  message: string;
  options: ChatOption[];
};

export type ChatTree = Record<string, ChatNode>;

export const chatTree: ChatTree = {
  start: {
    id: "start",
    message: "¡Hola! Soy Lex, el asistente del estudio. ¿Qué tipo de situación querés consultar?",
    options: [
      { text: "🏭 Accidente laboral", nextId: "q2" },
      { text: "🛣️ Accidente in itinere", nextId: "q2" },
      { text: "💊 Enfermedad profesional", nextId: "q3" },
      { text: "❌ Rechazo de ART", nextId: "q3" },
      { text: "📋 Otro", nextId: "form" },
    ],
  },
  q2: {
    id: "q2",
    message: "¿Cuándo ocurrió el accidente?",
    options: [
      { text: "📅 Hace menos de 1 año", nextId: "q4" },
      { text: "📅 Entre 1 y 3 años", nextId: "q4" },
      { text: "📅 Hace más de 3 años", nextId: "q4" },
    ],
  },
  q3: {
    id: "q3",
    message: "¿La ART ya fue notificada del caso?",
    options: [
      { text: "✅ Sí, está al tanto", nextId: "q4" },
      { text: "⏳ No todavía", nextId: "q4" },
      { text: "❓ No sé", nextId: "q4" },
    ],
  },
  q4: {
    id: "q4",
    message: "¿Estás recibiendo atención médica por la ART?",
    options: [
      { text: "✅ Sí", nextId: "form" },
      { text: "🚫 No, me la negaron", nextId: "form" },
      { text: "🏁 Ya me dieron el alta", nextId: "form" },
    ],
  },
};
```

- [ ] **Verificar tipos:**

```bash
cd /home/blackdance_user/Proyects/estudio-juridico/prop1 && npm run typecheck 2>&1 | tail -5
```

Esperado: sin errores nuevos.

- [ ] **Commit:**

```bash
git add lib/chat-tree.ts
git commit -m "feat: add decision tree data structure for chatbot"
```

---

## Task 2: Avatar Lex (`components/Chatbot/LexAvatar.tsx`)

**Files:**
- Create: `components/Chatbot/LexAvatar.tsx`

- [ ] **Crear `components/Chatbot/LexAvatar.tsx`:**

```tsx
type LexAvatarProps = {
  size?: number;
};

export function LexAvatar({ size = 28 }: LexAvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Cuerpo */}
      <rect x="6" y="7" width="16" height="12" rx="3" fill="#050505" />
      {/* Ojos */}
      <rect x="9" y="11" width="3" height="3" rx="1" fill="#b99a5b" />
      <rect x="16" y="11" width="3" height="3" rx="1" fill="#b99a5b" />
      {/* Boca */}
      <rect x="10" y="16" width="8" height="1.5" rx="0.75" fill="#b99a5b" />
      {/* Antena */}
      <line x1="14" y1="7" x2="14" y2="4" stroke="#050505" strokeWidth="1.5" />
      {/* Balanza — barra horizontal */}
      <line x1="10" y1="4" x2="18" y2="4" stroke="#050505" strokeWidth="1.5" />
      {/* Balanza — brazos */}
      <line x1="10" y1="4" x2="10" y2="6.5" stroke="#050505" strokeWidth="1" />
      <line x1="18" y1="4" x2="18" y2="6.5" stroke="#050505" strokeWidth="1" />
      {/* Cuerpo inferior / traje */}
      <rect x="10" y="19" width="8" height="5" rx="1" fill="#050505" />
      {/* Detalle corbata */}
      <rect x="12" y="21" width="4" height="1.5" rx="0.75" fill="#b99a5b" />
    </svg>
  );
}
```

- [ ] **Verificar tipos:**

```bash
npm run typecheck 2>&1 | tail -5
```

Esperado: sin errores nuevos.

- [ ] **Commit:**

```bash
git add components/Chatbot/LexAvatar.tsx
git commit -m "feat: add Lex robot-balance SVG avatar component"
```

---

## Task 3: Ventana del chat (`components/Chatbot/ChatWindow.tsx`)

**Files:**
- Create: `components/Chatbot/ChatWindow.tsx`

- [ ] **Crear `components/Chatbot/ChatWindow.tsx`:**

```tsx
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
```

- [ ] **Verificar tipos:**

```bash
npm run typecheck 2>&1 | tail -10
```

Esperado: sin errores nuevos.

- [ ] **Commit:**

```bash
git add components/Chatbot/ChatWindow.tsx
git commit -m "feat: add ChatWindow component with decision tree and WhatsApp integration"
```

---

## Task 4: Widget flotante (`components/Chatbot/ChatWidget.tsx`)

**Files:**
- Create: `components/Chatbot/ChatWidget.tsx`

- [ ] **Crear `components/Chatbot/ChatWidget.tsx`:**

```tsx
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
```

- [ ] **Verificar tipos:**

```bash
npm run typecheck 2>&1 | tail -10
```

Esperado: sin errores nuevos.

- [ ] **Commit:**

```bash
git add components/Chatbot/ChatWidget.tsx
git commit -m "feat: add floating chat button and animated chat window widget"
```

---

## Task 5: Wrapper con estado (`components/Chatbot/ChatbotWrapper.tsx`)

**Files:**
- Create: `components/Chatbot/ChatbotWrapper.tsx`

- [ ] **Crear `components/Chatbot/ChatbotWrapper.tsx`:**

```tsx
"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { ChatWidget } from "@/components/Chatbot/ChatWidget";

export function ChatbotWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Hero onOpenChat={() => setIsOpen(true)} />
      <ChatWidget isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
```

- [ ] **Verificar tipos** (va a fallar hasta completar Task 6 — normal):

```bash
npm run typecheck 2>&1 | grep -c "error TS"
```

Esperado: 1 error (Hero aún no acepta `onOpenChat`). Avanzar al Task 6.

- [ ] **Commit:**

```bash
git add components/Chatbot/ChatbotWrapper.tsx
git commit -m "feat: add ChatbotWrapper client component with shared isOpen state"
```

---

## Task 6: Modificar Hero (`components/Hero.tsx`)

**Files:**
- Modify: `components/Hero.tsx`

El Hero actual tiene un `<a>` que va directo a WhatsApp. Hay que convertirlo en un `<button>` que llame a `onOpenChat`.

- [ ] **Reemplazar** el contenido completo de `components/Hero.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
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
            Defensa legal en accidentes laborales y ART
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-porcelain/76">
            Asesoramiento claro para trabajadores que necesitan reclamar cobertura, tratamiento
            médico o una indemnización justa frente a la ART.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onOpenChat}
              className="group inline-flex items-center justify-center gap-3 bg-gold px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-gold-soft"
            >
              <MessageCircle size={18} />
              Iniciá tu consulta
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
```

- [ ] **Verificar tipos:**

```bash
npm run typecheck 2>&1 | tail -10
```

Esperado: sin errores.

- [ ] **Commit:**

```bash
git add components/Hero.tsx
git commit -m "feat: wire Hero CTA button to open chatbot instead of direct WhatsApp link"
```

---

## Task 7: Integrar en page (`app/page.tsx`)

**Files:**
- Modify: `app/page.tsx`

- [ ] **Reemplazar** el contenido completo de `app/page.tsx`:

```tsx
import { About } from "@/components/About";
import { ARTServices } from "@/components/ARTServices";
import { ChatbotWrapper } from "@/components/Chatbot/ChatbotWrapper";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Team } from "@/components/Team";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink text-porcelain">
      <Navbar />
      <ChatbotWrapper />
      <About />
      <ARTServices />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}
```

- [ ] **Verificar tipos y lint:**

```bash
npm run typecheck 2>&1 | tail -5 && npm run lint 2>&1 | tail -10
```

Esperado: 0 errores de tipos, 0 errores de lint.

- [ ] **Commit:**

```bash
git add app/page.tsx
git commit -m "feat: integrate ChatbotWrapper into page, replacing standalone Hero"
```

---

## Task 8: Verificación manual en el navegador

- [ ] **Arrancar el servidor de desarrollo:**

```bash
npm run dev
```

- [ ] **Verificar flujo completo** en `http://localhost:3000`:

  1. **Botón flotante** — visible en la esquina inferior derecha al cargar y al scrollear. Desaparece al abrir el chat.
  2. **CTA del hero** — clic en "Iniciá tu consulta" abre la ventana del chat.
  3. **Avatar Lex** — aparece en el header del chat con punto verde de "en línea".
  4. **Árbol de decisiones** — elegir "Accidente laboral" avanza a q2, elegir "Enfermedad profesional" avanza a q3. Cada respuesta queda como burbuja del usuario.
  5. **Formulario** — aparece al llegar al nodo final. Los 3 campos son requeridos.
  6. **WhatsApp** — clic en "Enviar por WhatsApp" abre una nueva pestaña con el mensaje pre-cargado en wa.me. Verificar que el mensaje incluye todas las respuestas del árbol + los datos del formulario.
  7. **Pantalla done** — tras abrir WhatsApp, Lex muestra el mensaje de confirmación.
  8. **Reset** — cerrar y reabrir el chat empieza el árbol desde el inicio.
  9. **Responsive** — verificar en viewport mobile (375px) que la ventana no se corta.

- [ ] **Commit final:**

```bash
git add -A
git commit -m "feat: complete chatbot decision tree with WhatsApp integration"
```
