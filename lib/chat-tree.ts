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
