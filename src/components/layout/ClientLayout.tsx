'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import ProgressLine from "@/components/layout/ProgressLine";
import ContentWrapper from "@/components/layout/ContentWrapper";
import ServiceModalWrapper from "@/components/modals/ServiceModalWrapper";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";
import { AbyssProvider } from "@/contexts/AbyssContext";
import { DropdownProvider } from "@/contexts/DropdownContext";

import { AuthProvider } from "@/contexts/AuthContext";
import { ServiceModalProvider } from "@/contexts/ServiceModalContext";
import { TransactionModalProvider } from "@/contexts/TransactionModalContext";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isIssueCardPage = pathname === '/issue-card';

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <AuthProvider>
      <DropdownProvider>
        <MarketplaceProvider>
          <AbyssProvider>
            <ServiceModalProvider>
              <TransactionModalProvider>
                {!isIssueCardPage && <ProgressLine />}
                {!isIssueCardPage && <Header />}
                <ServiceModalWrapper />
                <ContentWrapper>
                  <main className="min-h-screen">
                    {children}
                  </main>
                </ContentWrapper>
              </TransactionModalProvider>
            </ServiceModalProvider>
          </AbyssProvider>
        </MarketplaceProvider>
      </DropdownProvider>
    </AuthProvider>
  );
}
