import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Role Analyzer — Descubre tu Perfil IA",
  description: "Descubre tu arquetipo profesional IA y cuánto puede amplificarse tu productividad. Basado en datos de O*NET, Anthropic Economic Index y metodología Eloundou et al.",
  metadataBase: new URL("https://airoleanalyzer.com"),
  openGraph: {
    title: "AI Role Analyzer — Descubre tu Perfil IA",
    description: "Descubre tu arquetipo profesional IA y tu multiplicador de productividad.",
    siteName: "AI Role Analyzer",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Role Analyzer — Descubre tu Perfil IA",
    description: "Descubre tu arquetipo profesional IA y tu multiplicador de productividad.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
