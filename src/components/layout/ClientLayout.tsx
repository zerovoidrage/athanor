'use client';

import { useEffect } from "react";
import Header from "@/components/layout/Header";
import ProgressLine from "@/components/layout/ProgressLine";
import ContentWrapper from "@/components/layout/ContentWrapper";
import ServiceModalWrapper from "@/components/modals/ServiceModalWrapper";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";
import { DropdownProvider } from "@/contexts/DropdownContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ServiceModalProvider } from "@/contexts/ServiceModalContext";
import { TransactionModalProvider } from "@/contexts/TransactionModalContext";
import { ThreeJSCardModalProvider } from "@/contexts/ThreeJSCardModalContext";
import ThreeJSCardModal from "@/components/ThreeJSCardModal";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <AuthProvider>
      <DropdownProvider>
        <MarketplaceProvider>
          <ServiceModalProvider>
            <TransactionModalProvider>
              <ThreeJSCardModalProvider>
                <ProgressLine />
                <Header />
                <ServiceModalWrapper />
                <ThreeJSCardModal />
                <ContentWrapper>
                  <main className="min-h-screen">
                    {children}
                  </main>
                </ContentWrapper>
              </ThreeJSCardModalProvider>
            </TransactionModalProvider>
          </ServiceModalProvider>
        </MarketplaceProvider>
      </DropdownProvider>
    </AuthProvider>
  );
}
