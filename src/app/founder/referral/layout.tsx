import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referral | Athanor",
  description: "Referral program",
};

export default function ReferralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

