export type ChatOption = { text: string; nextId: string };
export type ChatNode = { id: string; message: string; options: ChatOption[] };
export type ChatTree = Record<string, ChatNode>;

export const chatTree: ChatTree = {
  start: {
    id: "start",
    message: "¡Hola! Soy tu abogado on-line. ¿Tu consulta es por un accidente de tránsito o por un accidente laboral / ART?",
    options: [
      { text: "🚗 Accidente de tránsito", nextId: "form-transito" },
      { text: "🏭 Accidente laboral / ART", nextId: "form-art" },
    ],
  },
};
