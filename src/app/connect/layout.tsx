import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect | Athanor",
  description: "Connect to Athanor",
};

export default function ConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

