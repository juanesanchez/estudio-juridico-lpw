# Medición: Google Tag Manager → GA4 / Google Ads

El sitio carga el contenedor **GTM-KJTWS7VD** y empuja al `dataLayer` un evento
por cada acción relevante. Las etiquetas de GA4 y las conversiones de Google Ads
se arman **dentro de la interfaz de Tag Manager**, sin volver a tocar el código.

## Configuración

El ID del contenedor vive en una variable de entorno:

```
NEXT_PUBLIC_GTM_ID=GTM-KJTWS7VD
```

- Local: [.env.local](../.env.local) (no se commitea).
- Producción: Vercel → Settings → Environment Variables, **más un redeploy**.
  Las `NEXT_PUBLIC_*` se inyectan en tiempo de build, así que un cambio no tiene
  efecto hasta reconstruir.

Con la variable vacía el sitio no carga ningún script de Google ni deja cookies.

## Eventos que emite el sitio

Cada uno llega al `dataLayer` como `{ event: "<nombre>", ...parámetros }`. En GTM
se capturan con un disparador de tipo **Evento personalizado** usando el nombre
exacto.

| Evento | Se dispara cuando | ¿Conversión? |
|---|---|---|
| `chatbot_lead` | Se envía el formulario del chatbot a WhatsApp | **Sí — la principal** |
| `contact_form_lead` | Se envía el formulario de la sección Contacto | **Sí** |
| `whatsapp_click` | Click en cualquier botón de WhatsApp | **Sí** |
| `phone_click` | Click en el teléfono | **Sí** |
| `email_click` | Click en el mail | Micro |
| `chat_open` | El usuario abre el chat a mano | Micro |
| `chatbot_form_start` | Elige una rama y llega al formulario largo | Micro |
| `directions_click` | Click en la dirección / "Cómo llegar" | Micro |

Parámetros disponibles como variables del dataLayer:

- `location` — dónde se hizo el click: `hero`, `navbar`, `navbar-mobile`,
  `boton-flotante`, `contacto`, `mapa`
- `case_type` — `accidente-transito` o `accidente-laboral-art`

Los eventos "micro" sirven para medir intención y armar audiencias de
remarketing, pero **no** conviene marcarlos como conversión: si Ads optimiza
para `chat_open` va a traer gente que abre el chat y se va.

`chat_open` no cuenta la apertura automática del chat en desktop
([ChatbotWrapper.tsx](../components/Chatbot/ChatbotWrapper.tsx)) — solo clicks
reales del usuario.

## Pasos pendientes dentro de GTM

Esto se hace desde `tagmanager.google.com`, no desde el código:

1. **Crear las variables del dataLayer** `location` y `case_type`
   (Variables → Nueva → Variable de capa de datos).
2. **Crear un disparador por evento**, tipo Evento personalizado, con el nombre
   exacto de la tabla de arriba.
3. **Etiqueta de GA4**: agregar la etiqueta de configuración de Google Analytics
   con el ID `G-…`, y etiquetas de evento GA4 para cada disparador.
4. **Conversiones de Google Ads**: crear la acción de conversión en Ads, y en GTM
   agregar una etiqueta "Seguimiento de conversiones de Google Ads" con el ID de
   conversión y la etiqueta que entrega Ads, asociada al disparador que
   corresponda.
5. **Probar en modo Vista previa** (botón "Vista previa" en GTM) antes de
   publicar el contenedor. Nada de lo configurado tiene efecto hasta apretar
   **Enviar / Publicar**.

## Privacidad

**No se envía ningún dato personal a Google.** El chatbot pide nombre, DNI,
dirección, obra social y detalles médicos, y nada de eso sale del navegador del
usuario: viaja solo a WhatsApp. Al dataLayer va únicamente el hecho de que la
acción ocurrió y la categoría del caso.

Esto no es opcional — mandar datos identificables a Google viola sus políticas y
expone al estudio. Al agregar eventos, mantener la regla: solo categorías y
ubicaciones, nunca contenido cargado por el usuario.

Lo mismo aplica dentro de GTM: **no configurar etiquetas que lean campos del
formulario del chatbot**. El código no los expone, pero GTM puede leer el DOM.

Falta definir con el cliente si el sitio necesita banner de consentimiento de
cookies. GTM deja cookies de terceros; en Argentina la Ley 25.326 no lo exige
explícitamente como el GDPR, pero si se hace publicidad a usuarios de la UE hay
que implementar Consent Mode v2.

## Acceso al contenedor

Quien tenga permisos de publicación en GTM-KJTWS7VD puede inyectar JavaScript
arbitrario en el sitio sin pasar por el repo ni por un deploy. Conviene que el
acceso de edición esté limitado a quien realmente lo necesite.

## Archivos

- [lib/analytics.ts](../lib/analytics.ts) — IDs, lista de eventos, `trackEvent()`
- [components/Analytics.tsx](../components/Analytics.tsx) — carga del contenedor
  y el `<noscript>`
- [app/layout.tsx](../app/layout.tsx) — dónde se montan
- [.env.example](../.env.example) — variables documentadas

## Probar sin GTM

Vaciando `NEXT_PUBLIC_GTM_ID`, `trackEvent()` loguea por consola en desarrollo:

```
[analytics] whatsapp_click { location: 'navbar' }
```

Sirve para verificar que cada botón dispara lo que corresponde sin depender del
contenedor.

## Verificar en producción

1. **Vista previa de GTM** (Tag Assistant) — conectar el sitio y confirmar que
   cada evento aparece en el panel izquierdo al hacer click.
2. **GA4 → Informes → Tiempo real** — navegar el sitio y ver los eventos entrar.
3. **Ads → Conversiones** — la columna "Estado" pasa a "Registrando conversiones"
   recién con la primera conversión real. Puede tardar hasta 24 h.

## Alternativa: gtag.js directo

El código soporta también cargar `gtag.js` sin GTM, con
`NEXT_PUBLIC_GOOGLE_ADS_ID` / `NEXT_PUBLIC_GA_MEASUREMENT_ID` y las variables
`NEXT_PUBLIC_ADS_LABEL_*`. Hoy no se usa. Los dos modos pueden convivir, pero
ojo con contar dos veces la misma conversión si GTM ya dispara la etiqueta.
