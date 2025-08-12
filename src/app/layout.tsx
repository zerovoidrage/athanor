import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import ProgressLine from "@/components/layout/ProgressLine";
import ContentWrapper from "@/components/layout/ContentWrapper";
import ServiceModalWrapper from "@/components/modals/ServiceModalWrapper";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";
import { DropdownProvider } from "@/contexts/DropdownContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ServiceModalProvider } from "@/contexts/ServiceModalContext";
import { TransactionModalProvider } from "@/contexts/TransactionModalContext";

export const metadata: Metadata = {
  title: "Athanor",
  description: "Athanor application",
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
        <AuthProvider>
          <DropdownProvider>
            <MarketplaceProvider>
              <ServiceModalProvider>
                <TransactionModalProvider>
                  <ProgressLine />
                  <Header />
                  <ServiceModalWrapper />
                  <ContentWrapper>
                    <main className="min-h-screen">
                      {children}
                    </main>
                  </ContentWrapper>
                </TransactionModalProvider>
              </ServiceModalProvider>
            </MarketplaceProvider>
          </DropdownProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
