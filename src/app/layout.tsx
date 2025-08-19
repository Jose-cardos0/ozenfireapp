import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

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
  keywords: [
    "treino",
    "dieta",
    "fitness",
    "feminino",
    "IA",
    "saúde",
    "academia",
  ],
  authors: [{ name: "Ozemfire Team" }],
  creator: "Ozemfire",
  publisher: "Ozemfire",
  robots: "index, follow",
  openGraph: {
    title: "Ozemfire - Treino Feminino com IA",
    description:
      "Crie sua cartilha de treino personalizada com inteligência artificial, focado no universo feminino",
    url: "https://ozemfire.com",
    siteName: "Ozemfire",
    images: [
      {
        url: "/ozemfirelogo.png.png",
        width: 1200,
        height: 630,
        alt: "Ozemfire - Treino Feminino com IA",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ozemfire - Treino Feminino com IA",
    description:
      "Crie sua cartilha de treino personalizada com inteligência artificial, focado no universo feminino",
    images: ["/ozemfirelogo.png.png"],
  },
  icons: {
    icon: [
      { url: "/ozemfirelogo.png.png", sizes: "16x16", type: "image/png" },
      { url: "/ozemfirelogo.png.png", sizes: "32x32", type: "image/png" },
      { url: "/ozemfirelogo.png.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      { url: "/ozemfirelogo.png.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/ozemfirelogo.png.png",
  },
  manifest: "/manifest.json",
  applicationName: "Ozemfire",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ozemfire",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Ozemfire",
    "msapplication-TileColor": "#FF99CC",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FF99CC",
  colorScheme: "light",
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
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
