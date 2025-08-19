import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ozemfire - Treino Feminino com IA",
  description:
    "Crie sua cartilha de treino personalizada com inteligência artificial, focado no universo feminino",
  icons: "/ozemfirelogo.png.png",
  openGraph: {
    title: "Ozemfire - Treino Feminino com IA",
    description:
      "Crie sua cartilha de treino personalizada com inteligência artificial, focado no universo feminino",
    images: [
      {
        url: "/ozemfirelogo.png.png",
        width: 1200,
        height: 630,
        alt: "Ozemfire - Treino Feminino com IA",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
