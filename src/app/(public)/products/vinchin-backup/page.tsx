import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { companyLegal } from "@/lib/site-config";
import {
  breadcrumbLd,
  faqPageLd,
  videoObjectLd,
  SITE_URL,
  ORG_ID,
  type FaqItem,
} from "@/lib/schema";

const PHONE_TEL = `tel:${companyLegal.phone.replace(/-/g, "")}`;
const DOCS_URL = "https://vinchin.myloket.co.kr";
const PAGE_PATH = "/products/vinchin-backup";
// 대용량 정적 자산(브로슈어 PDF, 데모 영상 mp4)은 배포 산출물(Vercel Deployment Storage)에 매번 실리지 않도록
// Supabase Storage의 공개 버킷 assets에서 제공한다(supabase/migrations/022, 023).
const ASSETS_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets`;
const BROCHURE_URL = `${ASSETS_URL}/brochures/vinchin-product-brochure.pdf`;
const VIDEO_BASE = `${ASSETS_URL}/videos/vinchin`;
const VIDEO_UPLOAD_DATE = "2026-08-23";

export const metadata: Metadata = {
  alternates: { canonical: PAGE_PATH },
  title: "Vinchin Backup & Recovery: 가상화 VM 백업·즉시 복구·V2V 전환 솔루션",
  description:
    "VMware vSphere, Hyper-V, Proxmox VE, XCP-ng, XenServer 등 15종 이상 가상화 플랫폼을 에이전트리스로 백업하고, 장애 시 VM을 즉시 복구하며 백업본을 다른 플랫폼으로 변환 복원(V2V)하는 Vinchin Backup & Recovery. 마이로켓 랩 실측 데모 영상 5편과 RTO/RPO 기준, 전환 절차를 공개합니다. VBTP 인증 엔지니어가 도입·구축·운영·유지보수를 지원합니다.",
};

/* 신뢰 지표 — Vinchin 공식 수치 (제품 소개용). */
const metrics = [
  { value: "100+", label: "서비스 국가" },
  { value: "1.6M+", label: "보호 중인 VM" },
  { value: "10,000+", label: "전 세계 고객사" },
  { value: "15+", label: "지원 가상화 플랫폼" },
];

/* 랩 실측 수치 — 2026-08-23 마이로켓 데모 랩(Vinchin 9.0, XenServer 8.4, ESXi, 1GbE)에서 측정. */
const labMetrics: { value: string; label: string; note: string }[] = [
  {
    value: "51.8초",
    label: "즉시 복구 후 웹 서비스 응답",
    note: "Debian 웹 서버 VM, 잡 시작 25초에 VM 기동",
  },
  {
    value: "약 20분",
    label: "ESXi VM 60GB를 XenServer로 변환 복원",
    note: "원본은 계속 운영 중이므로 중단 시간 아님",
  },
  {
    value: "10분 37초",
    label: "60GB VM 전체 백업, 저장 7.2GB",
    note: "압축 적용, 1GbE 랩 환경",
  },
  {
    value: "4분 38초",
    label: "격리 랩 자동 복구 검증 완료",
    note: "무결성, Ping, 하트비트, 스크린샷 검사 통과",
  },
];

/* 데모 영상 — Supabase Storage assets/videos/vinchin/. 무음, 한글 자막 내장. */
const demoVideos: {
  file: string;
  title: string;
  lead: string;
  desc: string;
  measured: string;
  seconds: number;
}[] = [
  {
    file: "instant-recovery",
    title: "즉시 복구 (Instant Recovery)",
    lead: "백업 저장소에서 VM을 바로 부팅합니다. 스톱워치와 서비스 화면을 함께 찍었습니다.",
    desc: "웹 서버 VM(Debian 13, MariaDB, nginx)을 강제 종료한 뒤 Instant Restore를 실행합니다. 잡 시작 25초에 VM이 기동되고, 51.8초에 웹 페이지가 다시 응답합니다. 운영 스토리지로 재이관하는 Migration 메뉴까지 보여줍니다.",
    measured: "VM 기동 25초, 웹 응답 51.8초",
    seconds: 221,
  },
  {
    file: "v2v-esxi-to-xenserver",
    title: "V2V 전환: ESXi VM을 XenServer로 변환 복원",
    lead: "백업본을 다른 하이퍼바이저로 복원합니다. 원본 ESXi VM은 끝까지 건드리지 않습니다.",
    desc: "vCenter와 XenServer를 한 콘솔에 등록하고, Windows 10 VM(60GB) 백업 포인트를 Cross-Platform Restore로 XenServer 8.4에 복원합니다. 드라이버 검사, 디스크와 네트워크 매핑, 복원 후 Windows 부팅 화면까지 담았습니다.",
    measured: "60GB 복원 약 20분, 추가 작업 없이 부팅",
    seconds: 163,
  },
  {
    file: "rollback-xenserver-to-esxi",
    title: "롤백 경로: XenServer 백업본을 VMware로 되돌리기",
    lead: "전환이 잘못되어도 돌아갈 길이 있습니다. 같은 기능을 반대 방향으로 씁니다.",
    desc: "XenServer에서 운영하던 Debian VM 백업본을 ESXi로 변환 복원합니다. vCenter 인벤토리 생성부터 ESXi 콘솔에서 GNOME 로그인까지 부팅합니다. NIC 이름이 달라져 고정 IP를 다시 잡아야 했던 사실도 자막으로 남겼습니다.",
    measured: "7.3GB 복원 5분 29초",
    seconds: 162,
  },
  {
    file: "verification-and-remote-access",
    title: "복구 검증 (Verification)과 원격 웹 콘솔 접속",
    lead: "백업본이 실제로 부팅되는지 격리 랩에서 자동으로 확인합니다.",
    desc: "HTTPS 웹 콘솔 로그인과 대시보드를 거쳐, Vinchin 내장 DR Lab(격리 네트워크)에서 백업본을 실제로 부팅하는 검증 잡을 만들고 실행합니다. 무결성 검사, 네트워크 Ping, 하트비트, 스크린샷 검사 결과와 리포트까지 보여줍니다.",
    measured: "검증 완료 4분 38초, 4개 검사 통과",
    seconds: 231,
  },
  {
    file: "xenserver-backup-job",
    title: "XenServer VM 백업 잡 생성과 실행",
    lead: "에이전트 없이 VM을 골라 백업합니다. 운영에 부담을 주지 않는 장치도 함께 봅니다.",
    desc: "VM 선별, 스케줄(전체 주 1회와 증분 매일), 암호화, 보관 정책, 전송 스레드, WORM과 멀웨어 스캔, Serial Snapshot, SpeedKit과 CBT 선택, Overload Protection을 차례로 설정하고 실행합니다. 실행 후 속도와 진행률을 확인합니다.",
    measured: "60GB 전체 백업 10분 37초, 저장 7.2GB",
    seconds: 124,
  },
];

/* 핵심 가치 — 왜 Vinchin인가 (Top reasons). */
const highlights: { title: string; desc: string; icon: string }[] = [
  {
    title: "에이전트리스 백업",
    desc: "게스트 OS에는 아무것도 설치하지 않습니다. 가상화 호스트에 경량 플러그인만 두고 VM을 통째로 백업하므로, VM이 늘어도 관리 부담과 장애 지점이 늘지 않습니다.",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    title: "즉시 복구 (Instant Recovery)",
    desc: "백업 저장소를 호스트에 직접 마운트해 VM을 바로 부팅합니다. 랩 실측으로 잡 시작 후 25초에 VM 기동, 51.8초에 웹 서비스가 응답했습니다. 업무를 먼저 살리고 운영 스토리지로는 나중에 옮깁니다.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "백업이 곧 전환 도구",
    desc: "대부분의 VM 백업 제품은 백업한 플랫폼으로만 복원합니다. Vinchin은 백업본을 다른 하이퍼바이저로 변환 복원하므로, VMware에서 XenServer나 Proxmox로 옮기는 전환과 돌아오는 롤백을 같은 제품으로 처리합니다.",
    icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
  },
  {
    title: "랜섬웨어 대비 구조",
    desc: "백업 데이터 암호화, WORM과 변경 불가(Immutable) 저장, 백업본 멀웨어 스캔으로 감염 뒤에도 깨끗한 복구 지점을 지킵니다. 원격지 복제까지 더하면 3-2-1 구성이 됩니다.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
];

/* 지원 가상화 플랫폼 — Vinchin 공식 지원 목록 기준. */
const platforms = [
  "VMware vSphere / ESXi",
  "Microsoft Hyper-V",
  "Proxmox VE",
  "XCP-ng",
  "Citrix XenServer (XenServer 9 공식 문서 등재)",
  "Red Hat Virtualization / oVirt",
  "Oracle Linux Virtualization (OLVM)",
  "Sangfor HCI",
  "Huawei FusionCompute",
  "H3C CAS / UIS",
  "OpenStack",
  "ZStack",
];

/* 추가 백업 대상 — VM 외 데이터. 콘솔의 Backup 메뉴 기준. */
const otherTargets = [
  "데이터베이스 (Oracle, MySQL, SQL Server, PostgreSQL 등)",
  "파일 서버 · NAS 데이터",
  "물리 Windows / Linux 서버",
  "Microsoft 365 (Exchange Online 등)",
  "오브젝트 스토리지 · Kubernetes · Hadoop HDFS",
];

/* 주요 기능 — 기능 카드. */
const features: { title: string; desc: string }[] = [
  {
    title: "증분·영구증분 백업",
    desc: "변경 블록만 백업합니다. 스냅샷 체인 의존이 낮은 SpeedKit이 기본이고, 전송량을 더 줄여야 하는 VM에는 CBT를 씁니다.",
  },
  {
    title: "중복제거·압축",
    desc: "백업 데이터 중복제거와 압축으로 저장 비용을 낮춥니다. 랩에서 60GB VM이 7.2GB로 저장됐습니다.",
  },
  {
    title: "GFS 보존 정책",
    desc: "일·주·월·년 단위 세대 보존(GFS)으로 장기 보관 요건을 충족합니다.",
  },
  {
    title: "오프사이트 복제",
    desc: "원격지 Vinchin 서버로 백업본을 복제해 본사 사고 시에도 복구 거점을 확보합니다. 전용선이나 VPN으로 연결합니다.",
  },
  {
    title: "클라우드 아카이브",
    desc: "S3 호환 오브젝트 스토리지로 장기 백업을 아카이빙합니다.",
  },
  {
    title: "암호화·WORM·멀웨어 스캔",
    desc: "전송과 저장 구간 암호화, WORM 보관, 백업본 멀웨어 스캔으로 백업 데이터 자체를 지킵니다.",
  },
  {
    title: "파일 단위 복구",
    desc: "VM을 부팅하지 않고 백업본을 마운트해 필요한 파일만 꺼냅니다. 웹 다운로드, 다른 서버로 전송, SMB 공유 세 가지 방법을 제공합니다.",
  },
  {
    title: "복구 검증",
    desc: "격리 랩에서 백업본을 실제로 부팅해 Ping, 하트비트, 스크린샷을 검사하고 리포트를 남깁니다. 일·주·월 단위로 자동 실행합니다.",
  },
  {
    title: "운영 부하 통제",
    desc: "Serial Snapshot, 전송 스레드 제한, Overload Protection, 대역폭 제한으로 백업 시간대의 IO를 통제합니다.",
  },
  {
    title: "단일 웹 콘솔",
    desc: "가상화, 클라우드, 물리 서버, DB, 파일, Microsoft 365를 한 화면에서 관리합니다. 콘솔은 영어 UI이며 마이로켓이 한글 헬프센터를 운영합니다.",
  },
];

/* 구성 요소 — 아키텍처. */
const components: { name: string; role: string }[] = [
  { name: "Master Server", role: "웹 콘솔, 스케줄, 백업 카탈로그를 담당하는 관리 서버입니다." },
  { name: "Backup Node", role: "데이터 전송과 저장소 연결을 맡습니다. 노드를 추가해도 라이선스 비용이 늘지 않습니다." },
  { name: "Host Plugin", role: "가상화 호스트(XenServer 풀 마스터와 슬레이브 등)에 설치하는 경량 플러그인입니다. 게스트 OS에는 설치하지 않습니다." },
  { name: "Backup Storage", role: "로컬 디스크, NAS, S3 호환 스토리지, 원격지 Vinchin 서버를 백업 저장소로 씁니다." },
];

/* VM 한 대의 전환 절차 — 랩 실측 기준. */
const migrationSteps: { step: string; what: string; service: string; time: string }[] = [
  { step: "1. 사전 백업", what: "원본 VM을 운영한 채로 Vinchin에 백업합니다.", service: "정상 운영", time: "60GB 전체 백업 약 10분" },
  { step: "2. 사전 복원", what: "백업본을 새 플랫폼으로 변환 복원합니다(Cross-Platform Restore).", service: "정상 운영", time: "60GB 약 20분" },
  { step: "3. 업무 검증", what: "새 플랫폼의 사본에서 업무팀이 기능을 테스트합니다. 격리 네트워크를 권장합니다.", service: "정상 운영", time: "업무팀 일정" },
  { step: "4. 컷오버", what: "원본을 정지하고 마지막 증분 백업을 받아 사본에 반영한 뒤 사본을 기동합니다.", service: "중단 구간", time: "증분과 변환 약 10분(환경 확인 필요)" },
  { step: "5. 후속 작업", what: "게스트 도구 교체, IP와 NIC 확인, 도메인 재가입, 모니터링 에이전트 설치를 진행합니다.", service: "기동 후", time: "VM당 10분에서 30분" },
  { step: "6. 원본 보존", what: "원본 VM을 정지 상태로 2주 보존합니다. 문제가 생기면 원본을 켜는 것이 가장 단순한 롤백입니다.", service: "-", time: "-" },
  { step: "7. 역방향 롤백", what: "필요하면 새 플랫폼의 백업본을 원래 플랫폼으로 되돌립니다.", service: "-", time: "7.3GB 약 5분 30초" },
];

/* 전환 후속 작업 체크리스트 — VM 1대 기준. */
const postMigrationChecks: { item: string; detail: string }[] = [
  { item: "게스트 도구", detail: "기존 플랫폼의 게스트 도구를 제거하고 새 플랫폼의 VM Tools를 설치합니다. 미설치 시 마이그레이션, 정상 종료, 모니터링이 되지 않습니다." },
  { item: "네트워크", detail: "NIC 이름이 바뀌므로(예: ens192에서 enX0) 고정 IP를 다시 설정하고 MAC 정책을 확인합니다. 랩 롤백 영상에서 실제로 발생했습니다." },
  { item: "AD와 인증", detail: "도메인 가입 상태, 컴퓨터 계정, 시간 동기화를 확인합니다." },
  { item: "라이선스", detail: "하드웨어 ID가 바뀌므로 OS와 일부 상용 소프트웨어의 라이선스 재활성화 여부를 확인합니다." },
  { item: "부팅 모드", detail: "UEFI/BIOS, Secure Boot, TPM 사용 여부를 사전에 확인합니다. XenServer 9는 UEFI 전용입니다." },
  { item: "스토리지", detail: "디스크 컨트롤러 변경, 멀티패스 설정, 남은 스냅샷을 정리합니다." },
  { item: "백업", detail: "새 플랫폼 쪽 백업 잡에 등록(Auto Join)하고 첫 전체 백업과 검증 잡 스케줄을 잡습니다." },
  { item: "운영", detail: "모니터링 에이전트 재설치, 작업 스케줄 확인, 운영 문서를 갱신합니다." },
];

/* RTO / RPO 기준표. */
const rtoRows: { config: string; rpo: string; rto: string; cond: string }[] = [
  { config: "일일 백업 + 전체 복원", rpo: "최대 24시간", rto: "VM당 수십 분에서 수 시간", cond: "대역폭과 스토리지 성능에 의존" },
  { config: "일일 백업 + 즉시 복구", rpo: "최대 24시간", rto: "1분 미만 달성 가능", cond: "운영 스토리지로 옮기기 전까지 백업 저장소 성능으로 임시 운영" },
  { config: "증분 주기 단축(예: 4시간) + 즉시 복구", rpo: "최대 4시간", rto: "1분 미만 달성 가능", cond: "스냅샷 부하 고려, SpeedKit 권장" },
  { config: "CDP (v8.0 이상)", rpo: "초 단위", rto: "동일", cond: "게스트 에이전트와 별도 라이선스 필요, 플랫폼별 지원 범위 확인" },
];

/* 도입 절차 4단계. */
const onboarding: { no: string; title: string; desc: string; need: string }[] = [
  { no: "01", title: "규모 확인", desc: "호스트와 VM 수, 스토리지 용량, 백업 주기, 보관 정책을 회신받습니다.", need: "고객 회신" },
  { no: "02", title: "데모 환경 원격 접속 테스트", desc: "마이로켓 데모 환경 콘솔에 2주간 접속해 백업 잡 생성, 즉시 복구, 파일 복구, 검증 결과를 직접 눌러 봅니다.", need: "접속 PC 공인 IP" },
  { no: "03", title: "용량 산정과 견적", desc: "백업 저장소 용량 산정 근거와 소켓 기준 라이선스 견적을 드립니다.", need: "1단계 수치" },
  { no: "04", title: "PoC (60일 체험판)", desc: "고객 환경에 전 기능 체험판을 설치해 실제 VM으로 백업, 즉시 복구, 필요 시 V2V 변환 복원을 실측합니다.", need: "호스트 1대와 백업 스토리지" },
];

/* 에디션 — 정직한 제품 소개 (가격 비노출, 정확한 구성은 견적·공식 데이터시트 기준). */
const editions: {
  name: string;
  badge: string;
  summary: string;
  points: string[];
  highlight: boolean;
}[] = [
  {
    name: "Standard",
    badge: "기본 백업",
    summary: "단일 가상화 환경의 정기 백업·복구가 필요한 경우.",
    points: [
      "에이전트리스 VM 백업·복구",
      "증분·영구증분 백업 (SpeedKit / CBT)",
      "GFS 보존 정책",
      "즉시 복구 · 파일 단위 복구",
      "오프사이트 복제 (Standard 이상)",
    ],
    highlight: false,
  },
  {
    name: "Enterprise",
    badge: "전사·재해복구",
    summary: "다중 환경·DR·랜섬웨어 대비까지 포함한 전사 운영용입니다. (Perpetual Enterprise 라인)",
    points: [
      "Standard의 모든 기능",
      "중복제거·압축",
      "클라우드 아카이브",
      "데이터베이스 백업",
      "백업 암호화 · WORM · 멀웨어 스캔",
      "크로스 플랫폼 V2V 변환 복원 (별도 라이선스 항목)",
    ],
    highlight: true,
  },
];

const faqs: FaqItem[] = [
  {
    q: "Vinchin Backup & Recovery는 어떤 제품인가요?",
    a: "VMware vSphere, Hyper-V, Proxmox VE, XCP-ng, XenServer 등 15종 이상의 가상화 플랫폼을 에이전트리스로 백업하고, 장애 시 VM을 즉시 복구하며 백업본을 다른 플랫폼으로 변환 복원(V2V)할 수 있는 가상화 전용 백업·복구 솔루션입니다.",
  },
  {
    q: "에이전트리스 백업이 무엇이고 왜 좋은가요?",
    a: "게스트 VM마다 백업 에이전트를 설치하지 않고 가상화 호스트에 경량 플러그인만 두고 VM을 통째로 백업하는 방식입니다. VM이 늘어도 에이전트 관리 부담이 없고, 에이전트 자체가 만드는 장애 지점이 줄어듭니다. VDI 마스터 이미지와 서버 VM에도 아무것도 넣지 않아도 됩니다.",
  },
  {
    q: "RTO 1분 미만이 실제로 가능한가요?",
    a: "VM 부팅 기준으로 즉시 복구(Instant Recovery)를 쓰면 달성 가능합니다. 마이로켓 랩 실측에서 Debian 웹 서버 VM이 잡 시작 25초에 기동되고 51.8초에 웹 서비스가 응답했습니다. 다만 두 가지 조건이 있습니다. 운영 스토리지로 옮기기 전까지는 백업 저장소 성능으로 임시 운영되고, DB급 시스템은 애플리케이션 일관성 백업이 전제되어야 합니다. Windows 10 VM은 첫 부팅 처리 때문에 잠금 화면까지 약 3분이 걸린 사례도 있어, 최종 SLA는 고객 환경에서 복구 리허설을 실측한 뒤 확정합니다.",
  },
  {
    q: "기존에 쓰던 가상화 플랫폼을 바꿔도 백업본을 쓸 수 있나요?",
    a: "가능합니다. Vinchin은 백업본을 다른 가상화 플랫폼으로 변환 복원하는 Cross-Platform Restore(V2V)를 지원합니다. 예를 들어 VMware에서 받은 백업을 XenServer, Proxmox VE, Hyper-V로 복원해 플랫폼 전환에 쓰고, 반대 방향으로 되돌리는 롤백도 같은 기능으로 처리합니다. 랩 실측으로 60GB Windows VM을 ESXi에서 XenServer로 약 20분에 복원했습니다. V2V는 별도 라이선스 항목입니다.",
  },
  {
    q: "XenServer(Citrix Hypervisor)를 제대로 지원하나요?",
    a: "네. Vinchin은 수년간 XenServer와 XCP-ng를 지원해 왔고, Citrix XenServer 9 공식 문서의 서드파티 백업 목록에 CBT 지원 벤더로 등재되어 있습니다. XenServer 풀 마스터와 슬레이브 호스트에 rpm 플러그인을 설치하는 방식이며, 게스트 OS에는 설치하지 않습니다.",
  },
  {
    q: "증분 백업 방식 SpeedKit과 CBT는 어떻게 다른가요?",
    a: "둘 다 변경 블록만 백업합니다. SpeedKit(기본값)은 디스크 스캔 비교 방식이라 스냅샷 체인 의존이 낮고, 장애가 나도 해당 시점만 실패하고 다음 백업은 정상입니다. CBT는 드라이버 방식이라 전송량이 가장 적지만 스냅샷 체인 의존이 높아 장애 시 전체 백업을 다시 받아야 할 수 있습니다. SpeedKit을 기본으로 두고, 성능 요구가 검증된 VM에만 CBT를 예외 적용하기를 권장합니다.",
  },
  {
    q: "백업 스토리지 용량은 어떻게 산정하나요?",
    a: "총 사용 용량, 일일 변경률(기본 가정 3~5%), 전체 백업 보관 개수(기본 4개), 증분 보관 일수(기본 30일), 중복제거·압축률(실측 전 가정 50%)로 계산합니다. 전체 백업 용량과 증분 용량을 더한 뒤 20% 여유를 둡니다. 예를 들어 VM 100대, 평균 80GB, 변경률 3%면 약 23.5TB가 나옵니다. 변경률과 압축률은 고객 데이터로 실측하기 전까지 가정값이며, 규모 수치를 받으면 산정 근거표를 드립니다.",
  },
  {
    q: "콘솔은 한국어를 지원하나요?",
    a: "Vinchin 웹 콘솔은 영어 UI만 제공합니다. 대신 마이로켓이 한글 기술 지원 센터(vinchin.myloket.co.kr)를 운영하고, 데모 영상에도 한글 자막을 넣어 두었습니다. 구축 후 운영 가이드도 한국어로 정리해 드립니다.",
  },
  {
    q: "Acronis와는 어떻게 다른가요?",
    a: "Acronis Cyber Protect는 서버·PC·NAS 같은 엔드포인트를 에이전트 기반으로 백업하고 랜섬웨어 방어·EDR을 함께 제공합니다. Vinchin은 가상화 호스트에 붙어 VM을 에이전트리스로 백업·즉시 복구하는 가상화 전용 솔루션입니다. 환경에 맞춰 둘을 조합하거나 한쪽만 운영할 수 있습니다.",
  },
  {
    q: "마이로켓은 Vinchin을 어떻게 지원하나요?",
    a: "마이로켓은 Vinchin Backup & Recovery를 취급하는 기술지원 회사로, 도입 전 환경 검토와 데모 환경 원격 접속 테스트, 60일 체험판 PoC, 구축·설정, 백업 정책 설계, 운영·유지보수, 복구 검증까지 지원합니다. 대표 엔지니어가 Vinchin 공식 기술자격(VBTP)을 보유하고 있습니다.",
  },
  {
    q: "도입 비용은 어떻게 되나요?",
    a: "라이선스는 보호 대상 호스트의 물리 CPU 소켓 수를 기본 단위로 하며 VM 수와 무관합니다. 영구 라이선스에 연간 유지보수(업데이트와 기술 지원)를 더하는 형태이고, 복원만 하는 호스트와 추가 백업 노드는 소켓 산정에서 제외됩니다. V2V 변환 복원과 CDP는 별도 항목입니다. 호스트 소켓 수, V2V 대상 VM 수, 원격지 구성 여부를 알려주시면 견적을 산출합니다.",
  },
];

/* JSON-LD — Product(SoftwareApplication) + Breadcrumb + FAQ + VideoObject. 가격은 비노출. */
const productLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Vinchin Backup & Recovery",
  applicationCategory: "Backup and Recovery Software",
  operatingSystem: "VMware vSphere, Microsoft Hyper-V, Proxmox VE, XCP-ng, Citrix XenServer",
  description:
    "15종 이상의 가상화 플랫폼을 에이전트리스로 백업하고, 즉시 복구·크로스 플랫폼 V2V 변환 복원·랜섬웨어 대비 보관·격리 랩 복구 검증을 지원하는 가상화 전용 백업·복구 솔루션.",
  url: `${SITE_URL}${PAGE_PATH}`,
  brand: { "@type": "Brand", name: "Vinchin" },
  provider: { "@type": "ProfessionalService", "@id": ORG_ID },
};

const ldObjects = [
  productLd,
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "제품", path: PAGE_PATH },
    { name: "Vinchin Backup & Recovery", path: PAGE_PATH },
  ]),
  faqPageLd(faqs),
  ...demoVideos.map((v) =>
    videoObjectLd({
      name: `Vinchin 데모: ${v.title}`,
      description: `${v.lead} ${v.measured}. 마이로켓 랩 실측 영상.`,
      contentUrl: `${VIDEO_BASE}/${v.file}.mp4`,
      thumbnailUrl: `${VIDEO_BASE}/${v.file}.jpg`,
      uploadDate: VIDEO_UPLOAD_DATE,
      durationSeconds: v.seconds,
      path: `${PAGE_PATH}#demo`,
    }),
  ),
];

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function DemoVideo({
  video,
  priority = false,
}: {
  video: (typeof demoVideos)[number];
  priority?: boolean;
}) {
  return (
    <video
      controls
      playsInline
      muted
      preload={priority ? "metadata" : "none"}
      poster={`${VIDEO_BASE}/${video.file}.jpg`}
      className="w-full h-full bg-slate-900"
      aria-label={`${video.title} 데모 영상`}
    >
      <source src={`${VIDEO_BASE}/${video.file}.mp4`} type="video/mp4" />
      브라우저가 동영상 재생을 지원하지 않습니다.{" "}
      <a href={`${VIDEO_BASE}/${video.file}.mp4`}>영상 파일 열기</a>
    </video>
  );
}

export default function VinchinBackupPage() {
  const heroVideo = demoVideos[0];
  return (
    <div className="bg-white">
      {ldObjects.map((o, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }}
        />
      ))}

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-gray-500">
          <Link href="/" className="hover:text-emerald-700">홈</Link>
          <span aria-hidden="true" className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">제품</span>
          <span aria-hidden="true" className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700 font-medium">Vinchin Backup &amp; Recovery</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative border-b border-gray-100">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-600 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-700 tracking-widest uppercase mb-5">
                Vinchin Backup &amp; Recovery
              </p>
              <h1 className="h-lead text-gray-900 leading-[1.25] kr-keep-all mb-5">
                가상화 VM을 통째로 백업하고,<br className="hidden md:block" />
                <span className="md:hidden"> </span>장애 시 즉시 복구합니다.
              </h1>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed kr-keep-all mb-8 max-w-xl">
                VMware·Hyper-V·Proxmox·XCP-ng·XenServer 등 15종 이상의 가상화 플랫폼을
                에이전트리스로 백업하고, 백업본을 다른 플랫폼으로 변환 복원하는 V2V 전환까지
                지원하는 가상화 전용 백업·복구 솔루션입니다. 아래 수치는 모두 마이로켓 랩에서
                실제로 재고 영상으로 남긴 값입니다.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <Link
                  href="/contact?source=vinchin-product&interest=vinchin&subject=Vinchin 백업 도입 문의"
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-semibold shadow-sm transition"
                >
                  도입·견적 문의
                </Link>
                <a
                  href="#demo"
                  className="px-5 py-2.5 bg-white text-gray-900 border border-gray-400 rounded-md hover:bg-gray-50 hover:border-gray-500 font-semibold transition"
                >
                  데모 영상 5편 보기
                </a>
                <a
                  href={PHONE_TEL}
                  className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium"
                >
                  <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {companyLegal.phone}
                </a>
              </div>
            </div>

            {/* 대표 데모 영상: 즉시 복구 실측 */}
            <figure className="w-full">
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <DemoVideo video={heroVideo} priority />
              </div>
              <figcaption className="mt-2 text-xs text-gray-600 kr-keep-all">
                즉시 복구 실측 영상 ({formatDuration(heroVideo.seconds)}). 잡 시작 25초에 VM 기동, 51.8초에 웹 서비스 응답. 무음, 한글 자막.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 신뢰 지표 */}
      <section className="border-b border-gray-100 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {metrics.map((m) => (
              <div key={m.label}>
                <p className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-1">
                  {m.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 kr-keep-all">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AEO 정의 문장 */}
      <section className="border-b border-gray-100 bg-emerald-50/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <p className="text-base sm:text-lg text-gray-800 leading-relaxed kr-keep-all max-w-3xl">
            <span className="font-semibold text-emerald-700">Vinchin Backup &amp; Recovery</span>는
            가상화 서버(VM)를 에이전트 설치 없이 호스트 레벨에서 통째로 백업하고, 장애 시 VM을
            즉시 복구하거나 백업본을 다른 가상화 플랫폼으로 변환 복원할 수 있는 가상화 전용
            백업·복구 솔루션입니다. 백업 제품이면서 플랫폼 전환 도구이기도 합니다.
          </p>
        </div>
      </section>

      {/* 랩 실측 수치 */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Lab Measured
          </p>
          <h2 className="h-base text-gray-900 mb-3 kr-keep-all">
            마케팅 수치가 아니라 랩에서 잰 값입니다
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            2026년 8월 마이로켓 데모 랩(Vinchin 9.0, XenServer 8.4, VMware ESXi, 1GbE)에서
            실제로 수행하며 측정했습니다. 화면에 작업 ID와 시계를 함께 찍어 영상으로 남겼고,
            아래 데모 영상에서 그대로 확인할 수 있습니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {labMetrics.map((m) => (
              <div key={m.label} className="p-5 rounded-xl bg-white border border-gray-200">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-1.5">{m.value}</p>
                <p className="text-sm font-semibold text-gray-900 kr-keep-all mb-1">{m.label}</p>
                <p className="text-xs text-gray-600 kr-keep-all">{m.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 kr-keep-all">
            * 즉시 복구 시간은 OS와 이미지 상태에 따라 달라집니다. 같은 랩에서 Windows 10 VM은 VM 기동
            15초, 잠금 화면까지 약 3분이 걸렸습니다. 고객 환경의 최종 SLA는 복구 리허설 실측 후 확정합니다.
          </p>
        </div>
      </section>

      {/* 핵심 가치 */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Why Vinchin
          </p>
          <h2 className="h-base text-gray-900 mb-8 kr-keep-all">
            가상화 백업에 특화된 이유
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="flex gap-4 p-6 rounded-xl bg-white border border-gray-200"
              >
                <span className="flex-shrink-0 w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={h.icon} />
                  </svg>
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5 kr-keep-all">
                    {h.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                    {h.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 데모 영상 */}
      <section id="demo" className="border-b border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Demo Videos
          </p>
          <h2 className="h-base text-gray-900 mb-3 kr-keep-all">
            랩 실측 데모 영상 5편
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            VM 한 대가 새 플랫폼으로 넘어가서 안전하게 운영되기까지를 하나의 이야기로
            담았습니다. 전환, 롤백, 즉시 복구, 복구 검증, 백업 잡 순서로 보시면 됩니다. 콘솔은
            영어 UI이며 한글 자막을 넣었고, 소리는 없습니다. 영상 속 IP와 계정은 마이로켓 랩
            전용입니다.
          </p>

          <div className="space-y-6">
            {demoVideos.map((v, i) => (
              <article
                key={v.file}
                className="grid grid-cols-1 lg:grid-cols-5 gap-5 p-5 rounded-xl bg-white border border-gray-200"
              >
                <div className="lg:col-span-3">
                  <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
                    <DemoVideo video={v} />
                  </div>
                </div>
                <div className="lg:col-span-2 flex flex-col">
                  <p className="text-xs font-bold text-emerald-700 tracking-widest mb-1.5">
                    {String(i + 1).padStart(2, "0")} · {formatDuration(v.seconds)}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 kr-keep-all mb-1.5">
                    {v.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-800 kr-keep-all mb-2">{v.lead}</p>
                  <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-3">{v.desc}</p>
                  <p className="mt-auto inline-flex items-start gap-2 text-sm text-gray-800 kr-keep-all">
                    <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      실측
                    </span>
                    <span>{v.measured}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-6 text-sm text-gray-600 kr-keep-all">
            파일 단위 복구(Granular Restore) 영상은 별도 요청 시 보여드립니다. 직접 눌러 보고
            싶으시면{" "}
            <Link
              href="/contact?source=vinchin-demo&interest=vinchin&subject=Vinchin 데모 환경 원격 접속 테스트 신청"
              className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
            >
              데모 환경 원격 접속 테스트
            </Link>
            를 신청하세요. 2주간 마이로켓 데모 콘솔에서 백업과 복구를 직접 수행할 수 있습니다.
          </p>
        </div>
      </section>

      {/* 전환 절차 */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Platform Migration
          </p>
          <h2 className="h-base text-gray-900 mb-3 kr-keep-all">
            VMware에서 XenServer로, VM 한 대의 전환 절차
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            원본은 끝까지 건드리지 않고, 실패하면 원본을 켭니다. 서비스가 멈추는 구간은 4단계
            컷오버뿐입니다. 복원에 걸리는 20분은 원본이 운영 중인 상태에서 진행되므로 중단
            시간이 아닙니다. 소요 시간은 랩 실측값이며 Proxmox, Hyper-V 등 다른 플랫폼으로의
            전환에도 같은 절차를 씁니다.
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">단계</th>
                  <th scope="col" className="px-4 py-3">무엇을 하나</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">서비스</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">소요 (랩 실측)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {migrationSteps.map((s) => (
                  <tr key={s.step} className={s.service === "중단 구간" ? "bg-amber-50/60" : undefined}>
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap align-top">{s.step}</td>
                    <td className="px-4 py-3 text-gray-700 kr-keep-all align-top">{s.what}</td>
                    <td className="px-4 py-3 whitespace-nowrap align-top">
                      {s.service === "중단 구간" ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">중단 구간</span>
                      ) : (
                        <span className="text-gray-700">{s.service}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 kr-keep-all align-top">{s.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500 kr-keep-all">
            대량 전환은 여러 VM을 한 잡으로 묶고 동시 복원 수와 대역폭 제한으로 조절합니다. 야간
            배치로 하루 N대씩 계획합니다.
          </p>

          <details className="group mt-6 rounded-xl bg-white border border-gray-200 p-5">
            <summary className="flex cursor-pointer items-start justify-between gap-3 text-base font-semibold text-gray-900 kr-keep-all">
              <span>전환이 끝난 뒤 남는 일: 후속 작업 체크리스트 (VM 1대 기준)</span>
              <span className="faq-chevron mt-1 flex-shrink-0 text-gray-600 transition-transform">
                <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {postMigrationChecks.map((c) => (
                <li key={c.item} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 mb-1">{c.item}</p>
                  <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">{c.detail}</p>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </section>

      {/* RTO / RPO */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            RTO / RPO
          </p>
          <h2 className="h-base text-gray-900 mb-3 kr-keep-all">
            RTO와 RPO, 어디까지 보장되는가
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            VM 부팅 기준 RTO 1분 미만은 즉시 복구로 달성할 수 있습니다. 숫자를 부풀리지 않기
            위해 조건을 먼저 적습니다.
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3">구성</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">RPO</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">RTO (VM 부팅 기준)</th>
                  <th scope="col" className="px-4 py-3">조건</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rtoRows.map((r) => (
                  <tr key={r.config}>
                    <td className="px-4 py-3 font-semibold text-gray-900 kr-keep-all align-top">{r.config}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap align-top">{r.rpo}</td>
                    <td className="px-4 py-3 text-gray-700 kr-keep-all align-top">{r.rto}</td>
                    <td className="px-4 py-3 text-gray-700 kr-keep-all align-top">{r.cond}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <p className="text-xs font-bold text-emerald-700 tracking-widest mb-1.5">조건 1</p>
              <p className="text-sm text-gray-800 leading-relaxed kr-keep-all">
                즉시 복구 상태에서는 백업 저장소 성능이 서비스 품질을 결정합니다. 운영 스토리지로
                재이관(Migration)까지 마쳐야 복구가 끝난 것입니다.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <p className="text-xs font-bold text-emerald-700 tracking-widest mb-1.5">조건 2</p>
              <p className="text-sm text-gray-800 leading-relaxed kr-keep-all">
                DB급 시스템은 애플리케이션 일관성 백업이 전제되어야 RPO 숫자가 의미를 가집니다.
                최종 SLA는 고객 환경에서 복구 리허설을 실측한 뒤 확정합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 지원 플랫폼 */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Supported Platforms
          </p>
          <h2 className="h-base text-gray-900 mb-3 kr-keep-all">
            지원 가상화 플랫폼
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            주요 상용·오픈소스 하이퍼바이저를 폭넓게 지원합니다. 단일 콘솔에서 멀티 플랫폼을
            함께 보호하고, 플랫폼 간 변환 복원도 가능합니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {platforms.map((p) => (
              <div
                key={p}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 text-sm text-gray-800 kr-keep-all"
              >
                <span className="text-emerald-700 font-bold flex-shrink-0">·</span>
                <span>{p}</span>
              </div>
            ))}
          </div>

          {/* 지원 대상 로고 모음: Vinchin 공식 자료. 가상화 외 6개 그룹까지 한 장에 담겨 있다. */}
          <figure className="rounded-xl bg-white border border-gray-200 p-3 sm:p-4 overflow-x-auto">
            <Image
              src="/products/vinchin/platforms.png"
              alt="Vinchin 지원 대상 로고 모음. 가상화(VMware, Hyper-V, Citrix, OpenStack, oVirt, Oracle Linux Virtualization, Red Hat, Proxmox, Huawei, H3C, Sangfor, XCP-ng, ZStack), PC와 워크스테이션(Windows, CentOS, Red Hat, Debian, Ubuntu, Rocky, SUSE, CentOS Stream, Oracle Linux), 데이터베이스(Oracle, SQL Server, PostgreSQL, Postgres Professional, MySQL, MariaDB), 파일과 NAS, S3 오브젝트 스토리지(AWS, Azure, Ceph, Tencent Cloud, Huawei, MinIO, Wasabi, Alibaba Cloud), 퍼블릭 클라우드(Huawei Cloud, AWS), 애플리케이션 SaaS(Exchange Server, Exchange Online)"
              width={1880}
              height={327}
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="w-full h-auto min-w-[640px]"
            />
            <figcaption className="mt-2 text-xs text-gray-500 kr-keep-all">
              Vinchin 공식 자료의 지원 대상 요약입니다. 가상화 외에 PC/워크스테이션, 데이터베이스,
              파일/NAS, S3 오브젝트 스토리지, 퍼블릭 클라우드, 애플리케이션 SaaS까지 한 콘솔에서 다룹니다.
            </figcaption>
          </figure>

          {/* 추가 백업 대상 */}
          <div className="mt-10">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Also Protects
            </p>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 kr-keep-all">
              VM 외 백업 대상
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {otherTargets.map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2.5 p-4 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 leading-relaxed kr-keep-all"
                >
                  <span className="text-emerald-700 font-bold flex-shrink-0 mt-0.5">·</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 주요 기능 + 구성 요소 */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Key Features
          </p>
          <h2 className="h-base text-gray-900 mb-8 kr-keep-all">
            주요 기능
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <ul className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((f) => (
                <li
                  key={f.title}
                  className="p-5 rounded-xl bg-white border border-gray-200"
                >
                  <h3 className="text-base font-semibold text-gray-900 mb-1.5 kr-keep-all">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                    {f.desc}
                  </p>
                </li>
              ))}
            </ul>

            {/* 구성 요소 */}
            <aside className="rounded-xl bg-slate-900 text-white p-6">
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-2">
                Architecture
              </p>
              <h3 className="text-lg font-semibold mb-4 kr-keep-all">구성 요소 4가지</h3>
              <ol className="space-y-4">
                {components.map((c, i) => (
                  <li key={c.name} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{c.name}</p>
                      <p className="text-xs text-slate-300 leading-relaxed kr-keep-all">{c.role}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-5 pt-4 border-t border-white/15 text-xs text-slate-300 leading-relaxed kr-keep-all">
                Master Server와 Backup Node는 한 서버에 같이 두어도 되고, 규모가 커지면 노드를
                나눕니다. 즉시 복구 때는 백업 저장소가 NFS SR로 호스트에 자동 마운트됩니다.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* 에디션 */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Editions &amp; Licensing
          </p>
          <h2 className="h-base text-gray-900 mb-3 kr-keep-all">
            에디션과 라이선스 구조
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            라이선스는 보호 대상 호스트의 물리 CPU 소켓 수가 기본 단위이며 VM 수와 무관합니다.
            영구 라이선스에 연간 유지보수(업데이트와 기술 지원)를 더하는 형태이고, 복원만 하는
            호스트와 추가 백업 노드는 소켓 산정에서 빠집니다. 60일 전 기능 체험판은 VM 수 제한이
            없습니다. 정확한 기능 구성은 공식 데이터시트와 견적 기준으로 안내드립니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editions.map((e) => (
              <div
                key={e.name}
                className={`flex flex-col p-6 rounded-xl bg-white border ${
                  e.highlight ? "border-emerald-300 ring-1 ring-emerald-200" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{e.name}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      e.highlight
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {e.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-5">
                  {e.summary}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {e.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-gray-700 kr-keep-all">
                      <span className="text-emerald-700 font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/contact?source=vinchin-product&interest=vinchin&subject=${encodeURIComponent(
                    `Vinchin ${e.name} 도입 문의`,
                  )}`}
                  className={`inline-flex items-center justify-center px-4 py-2.5 rounded-md font-semibold text-sm transition mt-auto ${
                    e.highlight
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-white text-gray-900 border border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {e.name} 견적 문의
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 kr-keep-all">
            * 크로스 플랫폼 변환 복원(V2V)과 CDP는 별도 라이선스 항목입니다. 견적은 전환 대상
            호스트의 소켓 수, V2V 대상 VM 수, 원격지 구성 여부를 받아 산출합니다. 라이선스는 단독
            판매가 아니라 환경 검토·도입·운영을 포함한 협업 형태로 안내드립니다.
          </p>
        </div>
      </section>

      {/* 도입 절차 */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Onboarding
          </p>
          <h2 className="h-base text-gray-900 mb-3 kr-keep-all">
            도입까지 4단계
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            영상만 보고 결정하지 않으셔도 됩니다. 마이로켓 데모 환경에 직접 접속해 눌러 보고, 그
            다음에 고객 환경에서 체험판으로 실측합니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {onboarding.map((s) => (
              <div key={s.no} className="flex flex-col p-5 rounded-xl bg-white border border-gray-200">
                <p className="text-xs font-bold text-emerald-700 tracking-widest mb-2">{s.no}</p>
                <h3 className="text-base font-semibold text-gray-900 mb-1.5 kr-keep-all">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-3">{s.desc}</p>
                <p className="mt-auto text-xs text-gray-500 kr-keep-all">필요한 것: {s.need}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <p className="flex-1 text-sm text-gray-800 leading-relaxed kr-keep-all">
              원격 접속 테스트는 브라우저만 있으면 됩니다. 접속 PC의 공인 IP를 알려주시면 2주간
              Operator 권한 계정을 드리고, 접속이 안 되면 화면 공유로 같이 봅니다. 고객 데이터는
              들어가지 않는 마이로켓 데모 환경입니다.
            </p>
            <Link
              href="/contact?source=vinchin-onboarding&interest=vinchin&subject=Vinchin 데모 환경 원격 접속 테스트 신청"
              className="flex-shrink-0 inline-flex items-center justify-center px-5 py-2.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-semibold text-sm transition"
            >
              원격 접속 테스트 신청
            </Link>
          </div>
        </div>
      </section>

      {/* 마이로켓이 제공하는 것 — 취급 솔루션·VBTP 정직 표기 */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            How Myloket Supports
          </p>
          <h2 className="h-base text-gray-900 mb-3 kr-keep-all">
            마이로켓이 제공하는 것
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            마이로켓은 Vinchin Backup &amp; Recovery를 취급하는 기술지원 회사입니다. 단순 라이선스
            판매가 아니라 도입 검토부터 구축·운영·복구검증까지 대표 엔지니어가 직접 책임집니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { no: "01", title: "도입 검토·PoC", desc: "현재 가상화 환경에 맞는 에디션·구성을 검토하고 데모 접속과 체험판 PoC로 검증합니다." },
              { no: "02", title: "구축·정책 설계", desc: "백업 정책, 보존 주기, 오프사이트·아카이브 구조를 설계하고 전환 절차를 함께 짭니다." },
              { no: "03", title: "운영·유지보수", desc: "백업 성공률·실패 이력을 점검하고 월간 보고서로 정리합니다." },
              { no: "04", title: "복구 검증", desc: "격리 랩 자동 검증 잡을 스케줄에 올리고, 실제 복구 리허설로 RTO를 실측해 기록합니다." },
            ].map((s) => (
              <div key={s.no} className="p-5 rounded-xl bg-white border border-gray-200">
                <p className="text-xs font-bold text-emerald-700 tracking-widest mb-2">{s.no}</p>
                <h3 className="text-base font-semibold text-gray-900 mb-1.5 kr-keep-all">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* VBTP 인증 배지 + Silver Partner 배지 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="inline-flex flex-shrink-0 items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold">
              <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              VBTP 인증
            </span>
            <p className="text-sm text-gray-700 leading-relaxed kr-keep-all">
              대표 엔지니어가 Vinchin 공식 기술자격{" "}
              <strong className="text-gray-900">VBTP(Vinchin Backup Technology Professional)</strong>를
              보유하고 있습니다. 인증서 번호·유효기간은{" "}
              <Link href="/about/certifications" className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800">
                인증 페이지
              </Link>
              에서 확인할 수 있습니다.
            </p>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl bg-white border border-gray-200">
            <Image
              src="/credentials/vinchin-silver-partner.png"
              alt="Vinchin Silver Partner"
              width={120}
              height={107}
              className="w-24 h-auto flex-shrink-0 mx-auto sm:mx-0"
            />
            <p className="text-sm text-gray-700 leading-relaxed kr-keep-all">
              마이로켓은 <strong className="text-gray-900">Vinchin 공식 Silver Partner</strong>로,
              라이선스 공급부터 구축·운영까지 벤더 파트너 자격을 갖추고 지원합니다. 제품 스펙과
              구성 옵션이 정리된{" "}
              <a
                href={BROCHURE_URL}
                target="_blank"
                rel="noopener"
                className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
              >
                제품 브로슈어(PDF)
              </a>
              를 다운로드해 확인할 수 있습니다. 기능별 상세 설명은{" "}
              <a
                href={DOCS_URL}
                target="_blank"
                rel="noopener"
                className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
              >
                한글 헬프센터
              </a>
              에 있습니다.
            </p>
          </div>

          <p className="mt-6 text-sm text-gray-600 kr-keep-all">
            엔드포인트(서버·PC·NAS) 백업과 함께 보려면{" "}
            <Link href="/services/acronis-backup" className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800">
              백업·보안 점검 서비스
            </Link>
            를 참고하세요.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            FAQ
          </p>
          <h2 className="h-base text-gray-900 mb-8 kr-keep-all">
            자주 묻는 질문
          </h2>
          <div className="space-y-3 max-w-3xl">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl bg-white border border-gray-200 p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-3 text-base font-semibold text-gray-900 kr-keep-all">
                  <span>{f.q}</span>
                  <span className="mt-1 flex-shrink-0 text-gray-600 transition-transform group-open:rotate-180">
                    <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed kr-keep-all">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-emerald-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Contact
          </p>
          <h2 className="h-base text-white mb-4 kr-keep-all">
            가상화 VM, 지금 제대로 백업되고 있나요?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-2xl leading-relaxed kr-keep-all">
            현재 가상화 플랫폼(VMware/Hyper-V/Proxmox/XenServer 등)과 VM 규모, 백업 현황만
            알려주시면 적합한 에디션·구성과 견적 방향을 회신드립니다. 플랫폼 전환을 검토 중이면
            전환 절차와 소요 시간 실측 계획까지 함께 드립니다.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact?source=vinchin-product-bottom&interest=vinchin&subject=Vinchin 백업 도입 문의"
              className="inline-block px-7 py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/30 transition hover:-translate-y-0.5"
            >
              도입·견적 문의
            </Link>
            <Link
              href="/contact?source=vinchin-product-bottom&interest=vinchin&subject=Vinchin 데모 환경 원격 접속 테스트 신청"
              className="inline-block px-7 py-3.5 bg-white/10 border border-white/60 text-white rounded-md hover:bg-white/20 font-semibold text-sm sm:text-base transition"
            >
              원격 접속 테스트 신청
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
