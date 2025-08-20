import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vault | Athanor",
  description: "Investment portfolio overview",
};

export default function VaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

