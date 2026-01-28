import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { BossProvider } from "@/context/BossProvider";

export const metadata: Metadata = {
  title: "Poke Raiday",
  description: "Prótotipo de minigame com a API do pokemon. Desenvolvido por github/joaovlara",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-200">
        <BossProvider>
          {children}
        </BossProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
