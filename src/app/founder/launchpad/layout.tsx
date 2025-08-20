import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Launchpad | Athanor",
  description: "Startup launchpad",
};

export default function LaunchpadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

