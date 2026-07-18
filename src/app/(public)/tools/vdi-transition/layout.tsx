import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VDI 역할 재정의 진단",
  description: "9문항으로 VDI 유지·보완·축소·재설계 4가지 시나리오 후보를 도출하는 무료 진단.",
  alternates: { canonical: "/tools/vdi-transition" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
