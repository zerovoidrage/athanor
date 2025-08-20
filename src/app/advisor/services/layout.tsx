import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Athanor",
  description: "Advisor services",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

