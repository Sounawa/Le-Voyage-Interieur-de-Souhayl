import type { Metadata } from "next";
import { Playfair_Display, Inter, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Le Voyage Intérieur de Souhayl — Tome 1: L'Éveil",
  description: "Un livre interactif immersif. Souhayl, 10 ans, découvre le Tassawuf et pénètre dans son monde intérieur pour affronter son ego et cheminer vers Allah.",
  keywords: ["Tassawuf", "Soufi", "livre interactif", "spiritualité", "Islam", "jeunesse"],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} ${amiri.variable} antialiased`}
        style={{
          fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
          backgroundColor: '#0a0a0f',
          color: '#f5f0e8',
          overflowX: 'hidden',
        }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
