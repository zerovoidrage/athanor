import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallet | Athanor",
  description: "Founder wallet",
};

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

