import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge Base | Athanor",
  description: "Athanor knowledge base",
};

export default function KnowledgeBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

