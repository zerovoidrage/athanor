import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import NextJSDevToolsRemover from "@/components/NextJSDevToolsRemover";
import { OverlayProvider } from "@/contexts/OverlayContext";

export const metadata: Metadata = {
  title: "Abyss | Athanor",
  description: "Athanor application",
  icons: {
    icon: '/avatar.png', // или любое другое изображение из public/
    shortcut: '/avatar.png',
    apple: '/avatar.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/SuisseIntl-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/SuisseIntl-Book.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/SuisseIntl-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/SuisseIntl-SemiBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/SuisseIntl-Light.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased bg-black text-white min-h-screen">
        <OverlayProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </OverlayProvider>
        <NextJSDevToolsRemover />
      </body>
    </html>
  );
}
