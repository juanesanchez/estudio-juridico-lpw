/**
 * Capa unica de medicion.
 *
 * Soporta dos modos, no excluyentes:
 *
 *  - Google Tag Manager (NEXT_PUBLIC_GTM_ID). Es el que usa este sitio. Los
 *    eventos se empujan al dataLayer y las etiquetas de GA4 / Ads se configuran
 *    desde la interfaz de GTM, sin tocar codigo.
 *  - gtag.js directo (NEXT_PUBLIC_GOOGLE_ADS_ID / NEXT_PUBLIC_GA_MEASUREMENT_ID),
 *    por si alguna vez se quiere prescindir de GTM.
 *
 * Mientras las variables esten vacias el sitio no carga ningun script de Google
 * y los eventos solo se loguean por consola en desarrollo.
 */

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";

/** true si hay que cargar gtag.js directo (independiente de GTM). */
export const gtagEnabled = Boolean(GA_MEASUREMENT_ID || GOOGLE_ADS_ID);

export const analyticsEnabled = Boolean(GTM_ID) || gtagEnabled;

export type TrackedEvent =
  /** Apertura manual del chat (Hero o boton flotante). No cuenta la apertura automatica en desktop. */
  | "chat_open"
  /** El usuario eligio una rama del arbol que abre el formulario largo. */
  | "chatbot_form_start"
  /** Lead completo desde el chatbot -> WhatsApp. Conversion principal. */
  | "chatbot_lead"
  /** Lead desde el formulario de la seccion Contacto -> WhatsApp. */
  | "contact_form_lead"
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "directions_click";

/**
 * Etiquetas de conversion de Google Ads para el modo gtag.js directo.
 *
 * NO hacen falta usando GTM: ahi la conversion se arma en la interfaz de Tag
 * Manager. Quedan vacias y solo aplican si algun dia se configura un AW- directo.
 *
 * Cada accion de conversion creada en Ads entrega un `send_to` con la forma
 * `AW-XXXXXXXXX/AbC-D_efGh`: aca va solo la segunda mitad (la etiqueta).
 *
 * Next.js inlinea `process.env.NEXT_PUBLIC_*` en tiempo de build, asi que hay que
 * escribir cada referencia literal: no se puede armar el nombre dinamicamente.
 */
const ADS_CONVERSION_LABELS: Partial<Record<TrackedEvent, string | undefined>> = {
  chatbot_lead: process.env.NEXT_PUBLIC_ADS_LABEL_CHATBOT_LEAD,
  contact_form_lead: process.env.NEXT_PUBLIC_ADS_LABEL_CONTACT_FORM_LEAD,
  whatsapp_click: process.env.NEXT_PUBLIC_ADS_LABEL_WHATSAPP_CLICK,
  phone_click: process.env.NEXT_PUBLIC_ADS_LABEL_PHONE_CLICK,
};

type EventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Reporta un evento. Nunca enviar datos personales del consultante (nombre, DNI,
 * telefono, direccion, detalle medico): solo categorias y el lugar del click.
 */
export function trackEvent(name: TrackedEvent, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  if (!analyticsEnabled) {
    if (process.env.NODE_ENV === "development") {
      console.info(`[analytics] ${name}`, params);
    }
    return;
  }

  // GTM: el evento queda disponible como disparador en la interfaz de Tag Manager.
  // Se inicializa el dataLayer por las dudas: si el usuario hace click antes de
  // que termine de cargar el contenedor, el evento queda encolado y GTM lo
  // procesa al arrancar en lugar de perderse.
  if (GTM_ID) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
  }

  // gtag.js directo. Se consulta la config, no `window.gtag`, porque GTM tambien
  // puede definir esa funcion y duplicaria cada evento.
  if (gtagEnabled) {
    window.gtag?.("event", name, params);

    const label = ADS_CONVERSION_LABELS[name];
    if (GOOGLE_ADS_ID && label) {
      window.gtag?.("event", "conversion", {
        send_to: `${GOOGLE_ADS_ID}/${label}`,
        ...params,
      });
    }
  }
}
