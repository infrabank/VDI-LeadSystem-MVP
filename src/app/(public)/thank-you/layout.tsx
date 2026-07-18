import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "접수 완료",
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
