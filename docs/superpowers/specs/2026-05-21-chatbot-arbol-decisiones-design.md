# Chatbot árbol de decisiones — Estudio Jurídico Ponte Wisto

**Fecha:** 2026-05-21
**Estado:** Aprobado

---

## Resumen

Widget de chatbot integrado en la landing page del estudio jurídico. Funciona como árbol de decisiones guiado por el bot "Lex" (avatar robot-balanza dorado). Al completar el árbol, el usuario llena un formulario con sus datos y el chat arma un mensaje pre-cargado que se abre directamente en WhatsApp.

---

## Puntos de entrada

- **Hero CTA:** el botón "Iniciá tu consulta" del hero abre el chat.
- **Botón flotante:** ícono dorado fijo en la esquina inferior derecha, visible en toda la página al scrollear.

Ambos comparten el mismo estado `isOpen` levantado a `page.tsx` y pasado como prop.

---

## Archivos

### Nuevos
```
components/
  Chatbot/
    ChatWidget.tsx     — wrapper: botón flotante + ventana, recibe isOpen/setIsOpen
    ChatWindow.tsx     — ventana del chat (árbol de decisiones + formulario)
    LexAvatar.tsx      — SVG del avatar robot-balanza (Lex)
lib/
  chat-tree.ts         — árbol de decisiones como estructura de datos tipada
```

### Modificados
```
app/page.tsx           — agrega estado isOpen, pasa props a Hero y ChatWidget
components/Hero.tsx    — recibe prop onOpenChat, lo dispara al hacer clic en CTA
```

---

## Modelo de datos (`lib/chat-tree.ts`)

```ts
type ChatOption = {
  text: string;     // texto del botón de opción
  nextId: string;   // id del nodo siguiente ('form' para ir al formulario)
};

type ChatNode = {
  id: string;
  message: string;  // mensaje que muestra Lex
  options: ChatOption[];
};

type ChatTree = Record<string, ChatNode>;
```

### Árbol genérico (placeholder — reemplazar con preguntas reales)

| Nodo | Mensaje de Lex | Opciones → nextId |
|------|----------------|-------------------|
| `start` | ¿Qué tipo de situación querés consultar? | Accidente laboral → `q2`, Accidente in itinere → `q2`, Enfermedad profesional → `q3`, Rechazo de ART → `q3`, Otro → `form` |
| `q2` | ¿Cuándo ocurrió el accidente? | Hace menos de 1 año → `q4`, Entre 1 y 3 años → `q4`, Hace más de 3 años → `q4` |
| `q3` | ¿La ART ya fue notificada? | Sí, está al tanto → `q4`, No todavía → `q4`, No sé → `q4` |
| `q4` | ¿Estás recibiendo atención médica por la ART? | Sí → `form`, No, me la negaron → `form`, Ya me dieron el alta → `form` |

---

## Estado del componente `ChatWindow`

```ts
currentNodeId: string              // nodo activo del árbol
history: { q: string; a: string }[] // respuestas acumuladas
phase: 'tree' | 'form' | 'done'   // qué pantalla se muestra
formData: { name: string; phone: string; desc: string }
```

### Flujo de fases

1. **tree** — Lex muestra el nodo actual con sus opciones como botones. Al elegir, guarda en `history` y avanza al `nextId`. Si `nextId === 'form'`, cambia fase.
2. **form** — Formulario de 3 campos: Nombre, Teléfono, Descripción breve. Botón "Enviar por WhatsApp".
3. **done** — Pantalla de confirmación: "¡Listo! Te redirigimos a WhatsApp". El chat puede cerrarse.

---

## Integración WhatsApp

Al enviar el formulario se construye el mensaje y se abre `wa.me`:

```
Hola, completé el formulario del sitio web.

📋 [pregunta 1]: [respuesta 1]
📋 [pregunta 2]: [respuesta 2]
...

👤 Nombre: [nombre]
📞 Teléfono: [teléfono]
📝 Descripción: [descripción]
```

URL: `https://wa.me/5491168063420?text=<mensaje codificado>`

Se abre con `window.open(url, '_blank')`.

---

## Avatar Lex (`LexAvatar.tsx`)

SVG inline. Robot minimalista con:
- Cuerpo cuadrado con bordes redondeados (color `#050505`)
- Ojos rectangulares (color `#b99a5b`)
- Antena con balanza de la justicia
- Fondo circular dorado (`#b99a5b`)
- Punto verde de "en línea" en la esquina inferior derecha del círculo

---

## Diseño visual del chat

- **Paleta:** ink (`#050505`), gold (`#b99a5b`), porcelain (`#fdfcf9`), parchment (`#f6f1e8`)
- **Ventana:** posición `fixed bottom-20 right-4`, ancho `w-80`, con `shadow-lift`
- **Header:** fondo `bg-ink`, avatar Lex + nombre "Lex — Asistente Legal" + subtítulo dorado
- **Burbujas del bot:** fondo `bg-ink/90`, texto `text-porcelain`
- **Botones de opción:** borde `border-gold/40`, hover `bg-gold/10`
- **Botón flotante:** círculo dorado `bg-gold`, ícono `MessageCircle` de lucide-react, `bottom-4 right-4`
- **Animaciones:** `framer-motion` (ya instalado) para entrada/salida de la ventana y de cada burbuja

---

## Restricciones

- Sin backend ni API — todo client-side.
- Sin dependencias nuevas — usa framer-motion y lucide-react ya instalados.
- El árbol se actualiza editando solo `lib/chat-tree.ts`, sin tocar componentes.
- El botón flotante no se muestra cuando el chat ya está abierto (evitar doble apertura).
