import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Poke Raiday",
  description: "Prótotipo de minigame com a API do pokemon. Desenvolvido por github/joaovlara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-200">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
