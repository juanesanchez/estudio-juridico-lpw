"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { chatTree } from "@/lib/chat-tree";
import type { ChatNode } from "@/lib/chat-tree";
import { LexAvatar } from "./LexAvatar";

type HistoryItem = { q: string; a: string };
type Phase = "tree" | "form-transito" | "form-art" | "done";
type FormValues = Record<string, string>;

type FormField = {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "tel" | "select-yesno" | "dni";
  pattern?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  title?: string;
};

const NOMBRE_PATTERN = "[A-Za-zÀ-ÿ\\s]{2,}";
const TEL_PATTERN    = "[+0-9\\s\\-\\(\\)]{6,20}";
const DNI_PATTERN    = "[0-9]{7,8}";

const TRANSITO_FIELDS: FormField[] = [
  { key: "nombre",            label: "Tu nombre y apellido",                       placeholder: "Juan Pérez",             pattern: NOMBRE_PATTERN, title: "Solo letras y espacios" },
  { key: "telefono",          label: "Tu teléfono",                                placeholder: "+54 9 11 0000-0000",     type: "tel", pattern: TEL_PATTERN, inputMode: "tel", title: "Solo números, +, espacios o guiones" },
  { key: "fecha",             label: "Fecha y hora del accidente",                  placeholder: "Ej: 15/05/2026, 14:30", title: "Ingresá fecha y hora" },
  { key: "calles",            label: "Calles / lugar del accidente",               placeholder: "Ej: Rivadavia y Corrientes" },
  { key: "localidad",         label: "Localidad",                                  placeholder: "Ej: Buenos Aires",      pattern: NOMBRE_PATTERN, title: "Solo letras y espacios" },
  { key: "vehiculoPropio",    label: "¿En qué circulabas? (marca, color, patente)", placeholder: "Honda Civic, azul, ABC123" },
  { key: "registro",          label: "¿Tenías registro?",                           type: "select-yesno" },
  { key: "seguroPropio",      label: "¿Tenías seguro?",                             type: "select-yesno" },
  { key: "policia",           label: "¿Se presentó la policía?",                   type: "select-yesno" },
  { key: "ambulancia",        label: "¿Se presentó la ambulancia?",                type: "select-yesno" },
  { key: "vehiculoContrario", label: "¿Qué vehículo te chocó?",                   placeholder: "Marca, tipo, color" },
  { key: "seguroContrario",   label: "¿El otro vehículo tenía seguro? ¿Cuál?",    placeholder: "Ej: Sí — Mapfre" },
  { key: "clinica",           label: "¿Dónde te atendieron?",                     placeholder: "Clínica u hospital" },
];

const ART_FIELDS: FormField[] = [
  { key: "nombre",         label: "Nombre y apellido",                      placeholder: "Juan Pérez",         pattern: NOMBRE_PATTERN, title: "Solo letras y espacios" },
  { key: "dni",            label: "DNI",                                    placeholder: "12345678",            type: "dni", pattern: DNI_PATTERN, inputMode: "numeric", title: "7 u 8 dígitos numéricos" },
  { key: "direccion",      label: "Dirección",                              placeholder: "Calle, número, localidad" },
  { key: "telefono",       label: "Tu teléfono",                            placeholder: "+54 9 11 0000-0000", type: "tel", pattern: TEL_PATTERN, inputMode: "tel", title: "Solo números, +, espacios o guiones" },
  { key: "trabajo",        label: "¿Dónde trabajás?",                       placeholder: "Empresa y domicilio" },
  { key: "horarioLaboral", label: "¿El accidente fue en horario laboral?",  type: "select-yesno" },
  { key: "traslado",       label: "¿Fue yendo o viniendo del trabajo?",     type: "select-yesno" },
  { key: "art",            label: "¿Qué ART tenés?",                        placeholder: "Nombre de la ART" },
  { key: "altaMedica",     label: "¿Ya te dieron el alta médica?",          type: "select-yesno" },
];

const WHATSAPP_NUMBER = "5491168063420";

const INPUT_CLASS =
  "border border-porcelain/15 bg-ink/60 px-3 py-2 text-xs text-porcelain placeholder-porcelain/40 outline-none focus:border-gold w-full";

function buildWhatsAppMessage(caseType: string, fields: FormField[], values: FormValues): string {
  return [
    `Hola, completé el formulario del sitio web — ${caseType}.`,
    "",
    ...fields.map((f) => `▸ ${f.label}: ${values[f.key] || "-"}`),
  ].join("\n");
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

function FormInput({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: string;
  onChange: (val: string) => void;
}) {
  if (field.type === "select-yesno") {
    return (
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT_CLASS} cursor-pointer appearance-none`}
      >
        <option value="" disabled>Seleccioná una opción</option>
        <option value="Sí">Sí</option>
        <option value="No">No</option>
      </select>
    );
  }

  return (
    <input
      required
      type={field.type === "tel" ? "tel" : "text"}
      inputMode={field.inputMode}
      pattern={field.pattern}
      title={field.title}
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={INPUT_CLASS}
    />
  );
}

export function ChatWindow() {
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [phase, setPhase] = useState<Phase>("tree");
  const [formValues, setFormValues] = useState<FormValues>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentNode: ChatNode = chatTree[currentNodeId];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, phase]);

  function handleOption(optionText: string, nextId: string) {
    setHistory((prev) => [...prev, { q: currentNode.message, a: optionText }]);
    if (nextId === "form-transito" || nextId === "form-art") {
      setPhase(nextId);
    } else {
      setCurrentNodeId(nextId);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const isTransito = phase === "form-transito";
    const fields = isTransito ? TRANSITO_FIELDS : ART_FIELDS;
    const caseType = isTransito ? "Accidente de tránsito" : "Accidente laboral / ART";
    const message = buildWhatsAppMessage(caseType, fields, formValues);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    setPhase("done");
  }

  const isFormPhase = phase === "form-transito" || phase === "form-art";
  const activeFields = phase === "form-transito" ? TRANSITO_FIELDS : ART_FIELDS;
  const formIntroMessage =
    phase === "form-transito"
      ? "Perfecto. Completá los datos del accidente para que el equipo pueda evaluar tu caso."
      : "Perfecto. Completá los datos para que podamos analizar tu situación con la ART.";

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
          <p className="text-sm font-semibold text-porcelain">Abogado on-line</p>
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

          {isFormPhase && (
            <motion.form
              key={phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-2"
            >
              <LexBubble message={formIntroMessage} />
              <div className="flex flex-col gap-2 pl-8">
                {activeFields.map((field) => (
                  <div key={field.key} className="flex flex-col gap-0.5">
                    <label className="text-[10px] uppercase tracking-wider text-porcelain/45">
                      {field.label}
                    </label>
                    <FormInput
                      field={field}
                      value={formValues[field.key] ?? ""}
                      onChange={(val) => setFormValues((v) => ({ ...v, [field.key]: val }))}
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="mt-2 bg-gold px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft"
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
