import type { Metadata } from "next";
import { Analytics, AnalyticsNoScript } from "@/components/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dr. Ponte Wisto Leonardo & Asoc. | Accidentes laborales y ART",
  description:
    "Estudio jurídico especializado en accidentes laborales, enfermedades profesionales y reclamos contra ART.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AnalyticsNoScript />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
