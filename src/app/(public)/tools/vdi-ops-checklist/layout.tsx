import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VDI 운영 진단 체크리스트",
  description:
    "Horizon Manual 풀 VM 한 대를 만들고 교체하는 데 지금 몇 분이 걸리고, 콘솔을 몇 개 열며, 단계가 몇 개인지 스스로 재는 양식입니다. 채운 결과는 인쇄하거나 마이로켓에 보낼 수 있습니다.",
  alternates: { canonical: "/tools/vdi-ops-checklist" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
