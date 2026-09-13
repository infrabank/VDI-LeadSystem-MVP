/**
 * 홈 팝업과 데모 신청 폼이 함께 쓰는 VDIOps 홍보 조건.
 * 2곳이 차거나 기한이 지나면 open을 false로 바꾼다. 팝업은 그 줄만 빼고 데모 계정 안내는 계속 띄운다.
 */
export const vdiopsPromo = {
  pocWaiver: {
    open: true,
    slots: 2,
    deadline: "2026-12-31",
  },
  dismissDays: 7,
  storageKey: "vdiops-promo-hide-until",
  sessionKey: "vdiops-promo-closed",
} as const;

export function formatKoreanDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

export function pocWaiverOpen(now = new Date()): boolean {
  const { open, deadline } = vdiopsPromo.pocWaiver;
  return open && now <= new Date(`${deadline}T23:59:59+09:00`);
}

export const DEMO_WANTS = [
  { value: "remote", label: "원격 데모 30분", desc: "마이로켓 실험실 화면을 공유하며 진행합니다" },
  { value: "account", label: "데모 계정 발급", desc: "실험실 VDIOps 조회 계정을 메일로 보내 드립니다" },
  { value: "poc-waiver", label: "PoC 비용 면제 신청", desc: "고객 환경 시범 도입 비용 면제, 선착순 2개 기관" },
] as const;

export type DemoWant = (typeof DEMO_WANTS)[number]["value"];
