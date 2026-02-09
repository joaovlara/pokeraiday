import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Poke Raiday",
  description: "Prótotipo de minigame com a API do pokemon. Desenvolvido por github/joaovlara",
  keywords: ["pokemon", "minigame", "poke raiday", "next.js"],
  authors: [{ name: "João Lara", url: "https://github.com/joaovlara" }],
  openGraph: {
    title: "Poke Raiday",
    description: "Prótotipo de minigame com a API do pokemon.",
    url: "https://poke-raiday.vercel.app",
    siteName: "Poke Raiday",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Poke Raiday Preview",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Poke Raiday",
    description: "Prótotipo de minigame com a API do pokemon.",
    images: ["/og-image.png"],
  },
};
