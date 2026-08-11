import Script from "next/script";
import {
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  GTM_ID,
  analyticsEnabled,
  gtagEnabled,
} from "@/lib/analytics";

/**
 * Carga el contenedor de Google Tag Manager y, si estuviera configurado, el
 * gtag.js directo. Sin ningun ID no renderiza nada: el sitio no pide scripts a
 * Google ni deja cookies.
 *
 * Va al final del <body>. La parte <noscript> del snippet de GTM se renderiza
 * aparte con <AnalyticsNoScript />, que tiene que ir al principio del <body>.
 */
export function Analytics() {
  if (!analyticsEnabled) return null;

  return (
    <>
      {GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}

      {gtagEnabled && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID || GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {[
              "window.dataLayer = window.dataLayer || [];",
              "function gtag(){dataLayer.push(arguments);}",
              "gtag('js', new Date());",
              GA_MEASUREMENT_ID && `gtag('config', '${GA_MEASUREMENT_ID}');`,
              GOOGLE_ADS_ID && `gtag('config', '${GOOGLE_ADS_ID}');`,
            ]
              .filter(Boolean)
              .join("\n")}
          </Script>
        </>
      )}
    </>
  );
}

/**
 * Fallback de GTM para navegadores con JavaScript deshabilitado.
 * Debe ir inmediatamente despues de la apertura del <body>.
 */
export function AnalyticsNoScript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
