import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Athanor",
  description: "User profile settings",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

