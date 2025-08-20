import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Athanor",
  description: "Founder profile settings",
};

export default function FounderProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

