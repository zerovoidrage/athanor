import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Athanor",
  description: "Advisor profile settings",
};

export default function AdvisorProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

