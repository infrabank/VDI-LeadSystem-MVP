import Link from "next/link";

/**
 * 진단 도구 하단 설명 섹션 — server component.
 *
 * 도구 페이지 본체는 전부 "use client"이고 risk-assessment는 useSearchParams 때문에
 * Suspense fallback만 정적 HTML에 들어간다. 그 결과 6개 도구 페이지의 서버 HTML이
 * 헤더·푸터·공통 폼만 남아 서로 83~90% 동일해졌고, 검색엔진이 이들을 한 페이지의
 * 중복으로 묶었다. 도구별 고유 본문을 서버에서 렌더해 이 문제를 해소한다.
 */

export type ToolSlug =
  | "risk-assessment"
  | "vdi-transition"
  | "n2sf-readiness"
  | "backup-readiness"
  | "roi-calculator"
  | "backup-roi";

interface ExplainerContent {
  heading: string;
  lead: string;
  covers: { title: string; desc: string }[];
  outputs: string[];
  audience: string[];
  faq: { q: string; a: string }[];
  related: { href: string; label: string }[];
}

const CONTENT: Record<ToolSlug, ExplainerContent> = {
  "risk-assessment": {
    heading: "N²SF 정렬 진단은 무엇을 판단하나",
    lead:
      "이미 운영 중인 VDI·망분리 환경을 N²SF(국가 망 보안체계) 기준에 대보고, 지금 구조를 그대로 유지해도 되는 영역과 손대야 하는 영역을 갈라내는 진단입니다. 8단계 문항을 채우면 등급 분류부터 접속 통제까지 한 번에 훑습니다.",
    covers: [
      { title: "기본 정보", desc: "가상화 플랫폼, VM·호스트 수, 동시 접속 사용자 규모를 확인합니다." },
      { title: "N²SF 등급 분류", desc: "처리하는 정보를 C(기밀)·S(민감)·O(공개)로 예비 분류합니다. 개인정보·영업비밀·감사로그가 섞여 있으면 혼재 등급으로 따로 잡습니다." },
      { title: "정보서비스 모델", desc: "N²SF 부록2의 운용 시나리오 중 어디에 해당하는지 골라 권고 통제를 매핑합니다." },
      { title: "아키텍처·스토리지", desc: "스토리지 구성과 네트워크 아키텍처가 등급별 통제를 감당할 수 있는지 봅니다." },
      { title: "가용성·DR", desc: "백업, 재해 복구, 가용성 체계의 현재 수준을 확인합니다." },
      { title: "운영·변경관리", desc: "운영 인력, 변경 관리 절차, 문서화 수준을 점검합니다." },
      { title: "자동화·확장성", desc: "자동화 수준과 증설 대응력을 확인합니다." },
      { title: "보안·접속", desc: "접속 방식과 인증 체계가 등급 요구에 맞는지 봅니다." },
    ],
    outputs: [
      "VDI 유지·축소·전환에 대한 1차 검토 의견",
      "업무·시스템 단위 C/S/O 등급 예비 분류표",
      "MFA를 어디에 어떤 정책으로 적용할지에 대한 보완 지점",
      "백업·DR 보완 지점",
      "1쪽 요약 PDF",
    ],
    audience: [
      "N²SF 개정 지침 시행을 앞두고 현재 환경이 어느 정도 준비됐는지 가늠해야 하는 담당자",
      "보안성 검토나 감사에서 망분리 구조를 설명할 근거가 필요한 경우",
      "차기 정보화사업 사양에 N²SF를 반영해야 하는데 출발점을 못 잡은 경우",
    ],
    faq: [
      {
        q: "여기서 나온 C/S/O 등급이 확정 등급인가요?",
        a: "아닙니다. 입력값 기준의 예비 분류입니다. 실제 등급은 기관의 업무 분류 체계와 소관 부처 판단이 함께 들어가야 확정됩니다. 이 결과는 내부 논의를 시작하는 초안으로 쓰시는 것이 맞습니다.",
      },
      {
        q: "진단 결과만으로 전환 여부를 결정해도 되나요?",
        a: "권하지 않습니다. 8단계 문항은 환경의 큰 윤곽을 잡는 수준입니다. 실제 전환 판단에는 현장 실사, 업무별 트래픽 분석, 예산 일정이 함께 필요합니다.",
      },
      {
        q: "입력한 환경 정보는 어떻게 처리되나요?",
        a: "진단 결과 제공과 상담 안내 목적으로만 씁니다. 수집 항목과 보관 기간은 개인정보 처리방침에 적어 두었습니다.",
      },
    ],
    related: [
      { href: "/n2sf", label: "N²SF 개요와 시행 일정" },
      { href: "/insights/n2sf-grade-classification-guide", label: "C/S/O 등급 분류 가이드" },
      { href: "/tools/n2sf-readiness", label: "N²SF 전환 준비도 진단" },
    ],
  },

  "vdi-transition": {
    heading: "VDI 역할 재정의 진단은 무엇을 판단하나",
    lead:
      "망분리 완화 이후 지금의 VDI를 어떻게 다룰지 정하는 진단입니다. 9개 문항으로 유지·보완·축소·재설계 네 시나리오에 가중치를 매겨, 어느 쪽이 현재 환경에 가장 가까운지 후보를 뽑습니다.",
    covers: [
      { title: "VDI가 담당하는 업무", desc: "개인정보·기밀을 다루는 고위험 업무인지, 일반 사무인지, 인터넷 접속 전용인지, 재택·외부 접속용인지에 따라 판단이 갈립니다." },
      { title: "인터넷망이냐 업무망이냐", desc: "인터넷망 VDI는 축소 후보로, 업무망 VDI는 유지 후보로 기울어집니다." },
      { title: "사용자 불만 빈도", desc: "항시적 불만이 있으면 유지보다 재설계 쪽 가중치가 올라갑니다." },
      { title: "운영 장애 빈도", desc: "잦은 중대 장애는 현재 구조 자체를 다시 봐야 한다는 신호로 잡습니다." },
    ],
    outputs: [
      "유지·보완·축소·재설계 네 시나리오별 적합도",
      "가장 가까운 시나리오와 그렇게 나온 근거",
      "다음 단계로 확인해야 할 항목",
    ],
    audience: [
      "인터넷망 VDI를 계속 둘지 정리해야 하는 기관",
      "사용자 불만과 운영 부담이 쌓여 VDI 구조를 다시 볼 시점이 된 경우",
      "망분리 완화 이후 VDI 예산 근거를 다시 만들어야 하는 경우",
    ],
    faq: [
      {
        q: "축소로 나오면 VDI를 걷어내라는 뜻인가요?",
        a: "아닙니다. 지금 VDI가 맡고 있는 역할 중 다른 방식으로 대체 가능한 부분이 있다는 뜻입니다. 무엇을 남기고 무엇을 옮길지는 업무 단위로 따로 봐야 합니다.",
      },
      {
        q: "9문항이면 너무 적지 않나요?",
        a: "방향 후보를 좁히는 용도입니다. 판단에 가장 크게 작용하는 변수만 넣었고, 확정 설계에는 현장 실사가 따로 필요합니다.",
      },
    ],
    related: [
      { href: "/insights/vdi-decision-matrix", label: "VDI 의사결정 매트릭스" },
      { href: "/insights/vdi-keep-reduce-transition-checklist", label: "유지·축소·전환 체크리스트" },
      { href: "/practices/vdi-workspace", label: "VDI 워크스페이스 실무" },
    ],
  },

  "n2sf-readiness": {
    heading: "N²SF 전환 준비도 진단은 무엇을 판단하나",
    lead:
      "N²SF 전환을 시작하기 전에 기관의 현재 성숙도가 어느 단계인지 확인하는 진단입니다. 5개 영역 15문항을 채우면 단계별 로드맵 형태로 정리해 드립니다.",
    covers: [
      { title: "망분리·VDI 현황", desc: "물리·논리·혼합·부분 중 어떤 구조인지, 전체 업무에서 VDI가 차지하는 비중이 얼마인지 확인합니다." },
      { title: "데이터·업무 분류", desc: "업무와 데이터를 등급으로 나눠 본 적이 있는지, 분류 체계가 문서로 남아 있는지 봅니다." },
      { title: "인증·접근 통제", desc: "현재 인증 방식과 접근 통제 수준을 확인합니다. MFA 의무화 대응의 출발점입니다." },
      { title: "클라우드·SaaS 활용", desc: "외부 서비스 사용 현황이 O등급 영역 설계에 직접 영향을 줍니다." },
      { title: "운영·예산 준비도", desc: "인력과 예산이 전환 일정을 감당할 수 있는지 봅니다." },
    ],
    outputs: [
      "5개 영역별 준비도 점수",
      "3단계 전환 로드맵",
      "가장 먼저 손대야 할 영역",
    ],
    audience: [
      "N²SF 전환을 어디서부터 시작할지 정해야 하는 기관",
      "전환 예산과 일정을 내부에 설명할 근거가 필요한 담당자",
      "보안 예산 15%·인력 10% 의무화에 대비해 현재 수준을 재 봐야 하는 경우",
    ],
    faq: [
      {
        q: "정렬 진단과 준비도 진단은 뭐가 다른가요?",
        a: "정렬 진단은 이미 있는 VDI 환경을 N²SF 기준에 대보는 쪽이고, 준비도 진단은 기관 전체가 전환을 감당할 수 있는 상태인지를 봅니다. 환경이 아니라 조직·절차·예산 쪽에 무게가 실려 있습니다.",
      },
      {
        q: "점수가 낮게 나오면 전환이 어렵다는 뜻인가요?",
        a: "시작 지점이 뒤에 있다는 뜻이지 불가능하다는 뜻은 아닙니다. 로드맵은 낮은 점수를 전제로도 순서를 잡을 수 있게 나옵니다.",
      },
    ],
    related: [
      { href: "/n2sf", label: "N²SF 개요와 시행 일정" },
      { href: "/insights/n2sf-pre-diagnosis-checklist", label: "N²SF 사전 진단 체크리스트" },
      { href: "/tools/risk-assessment", label: "N²SF 정렬 진단" },
    ],
  },

  "backup-readiness": {
    heading: "백업·사이버복원력 자가 진단은 무엇을 판단하나",
    lead:
      "백업이 있느냐가 아니라 실제로 복구되느냐를 보는 진단입니다. 7개 영역 25문항으로 적용 범위부터 복구 검증까지 훑고, 어느 구간이 비어 있는지 짚습니다.",
    covers: [
      { title: "백업 적용 범위", desc: "서버·VM을 어디까지 담고 있는지, 엔드포인트까지 포함하는지 확인합니다." },
      { title: "백업 주기·정책", desc: "주기와 보존 정책이 업무 중요도에 맞게 나뉘어 있는지 봅니다." },
      { title: "랜섬웨어 보호", desc: "백업본 자체가 암호화 대상이 되지 않도록 막고 있는지 확인합니다." },
      { title: "복구 검증", desc: "복구를 실제로 해 본 적이 있는지, 주기적으로 검증하는지 봅니다. 여기가 비어 있는 기관이 가장 많습니다." },
      { title: "RTO·RPO 정의", desc: "허용 가능한 중단 시간과 데이터 손실 범위가 숫자로 정의돼 있는지 확인합니다." },
      { title: "DR·페일오버", desc: "재해 상황에서 옮겨 갈 곳이 준비돼 있는지 봅니다." },
      { title: "백업 보안", desc: "백업 인프라 자체의 접근 통제 수준을 확인합니다." },
    ],
    outputs: [
      "7개 영역별 성숙도 점수",
      "보완 우선순위",
      "웹 리포트와 PDF",
    ],
    audience: [
      "백업은 돌고 있는데 복구가 될지 확신이 없는 담당자",
      "랜섬웨어 대응 체계를 점검해야 하는 기관",
      "RTO·RPO를 처음 정의해야 하는 경우",
    ],
    faq: [
      {
        q: "특정 백업 제품을 쓰고 있어야 하나요?",
        a: "아닙니다. 문항은 제품이 아니라 운영 방식을 묻습니다. Acronis·Vinchin을 쓰지 않아도 그대로 진단할 수 있습니다.",
      },
      {
        q: "복구 검증을 한 번도 안 했는데 진단이 의미가 있나요?",
        a: "그 경우가 오히려 진단 효과가 큽니다. 어디부터 검증을 시작해야 하는지 순서가 나옵니다.",
      },
    ],
    related: [
      { href: "/insights/rto-rpo-decision-framework", label: "RTO·RPO 결정 프레임워크" },
      { href: "/insights/3-2-1-backup-rule-explained", label: "3-2-1 백업 규칙" },
      { href: "/insights/ransomware-recovery-playbook", label: "랜섬웨어 복구 플레이북" },
    ],
  },

  "roi-calculator": {
    heading: "VDI 운영 ROI 시뮬레이션은 무엇을 계산하나",
    lead:
      "VDI 도입·전환을 검토할 때 경영진에게 낼 비용 근거를 만드는 계산기입니다. 사용자 규모와 현재 운영 조건을 넣으면 마이그레이션 비용과 운영비를 기간별로 펼쳐 보여 줍니다.",
    covers: [
      { title: "사용자 규모", desc: "동시 접속 사용자 수가 라이선스와 인프라 비용의 기준이 됩니다." },
      { title: "현재 운영 비용", desc: "지금 쓰고 있는 단말·유지보수 비용을 기준선으로 잡습니다." },
      { title: "전환 기간", desc: "몇 개월에 걸쳐 옮길지에 따라 초기 비용의 분포가 달라집니다." },
      { title: "산정 기간", desc: "몇 년을 놓고 볼지에 따라 회수 시점이 바뀝니다." },
    ],
    outputs: [
      "기간별 비용 시뮬레이션",
      "경영진 보고용 PDF",
    ],
    audience: [
      "VDI 예산안을 처음 만드는 담당자",
      "물리 PC 유지와 VDI 전환의 비용 차이를 숫자로 비교해야 하는 경우",
    ],
    faq: [
      {
        q: "여기 나온 숫자를 그대로 예산안에 써도 되나요?",
        a: "입력값 기준의 추정치입니다. 실제 견적은 라이선스 조건, 기존 자산 잔존가, 기관별 조달 단가에 따라 달라집니다. 내부 검토용 초안으로 쓰시는 것이 맞습니다.",
      },
    ],
    related: [
      { href: "/insights/daas-migration-guide", label: "DaaS 마이그레이션 가이드" },
      { href: "/services/vdi-support", label: "VDI 기술지원 서비스" },
    ],
  },

  "backup-roi": {
    heading: "백업 ROI 계산기는 무엇을 계산하나",
    lead:
      "백업 투자를 결재선에 올릴 때 쓰는 계산기입니다. 장애와 랜섬웨어 시나리오를 놓고 5년 누적으로 얼마를 피할 수 있는지, 투자 회수까지 얼마나 걸리는지 산출합니다.",
    covers: [
      { title: "장애 시나리오", desc: "일반 장애로 인한 중단 시간과 그 비용을 잡습니다." },
      { title: "랜섬웨어 시나리오", desc: "감염 시 예상되는 손실 규모를 별도로 계산합니다." },
      { title: "5년 누적 회피 비용", desc: "단년이 아니라 누적으로 봐야 투자 대비 효과가 드러납니다." },
      { title: "ROI와 Payback", desc: "투자 대비 수익률과 회수 시점을 함께 냅니다." },
    ],
    outputs: [
      "시나리오별 5년 누적 회피 비용",
      "ROI와 Payback 기간",
      "경영진 보고용 근거 자료",
    ],
    audience: [
      "백업 예산을 새로 확보해야 하는 담당자",
      "Acronis PoC나 DR·페일오버 도입을 검토 중인 기관",
      "MSP 운영 전환의 비용 효과를 따져야 하는 경우",
    ],
    faq: [
      {
        q: "손실 비용은 어떻게 잡나요?",
        a: "중단 시간과 영향 범위를 입력값으로 받아 계산합니다. 기관마다 업무 가치가 달라 기본값을 그대로 쓰기보다 실제 수치로 바꿔 넣는 편이 정확합니다.",
      },
      {
        q: "백업 성숙도 진단과 같이 봐야 하나요?",
        a: "그 편이 낫습니다. 성숙도 진단이 어디가 비었는지 알려 주고, 이 계산기가 그 구멍을 메우는 비용의 정당성을 만듭니다.",
      },
    ],
    related: [
      { href: "/tools/backup-readiness", label: "백업·사이버복원력 자가 진단" },
      { href: "/products/acronis-cyber-protect", label: "Acronis Cyber Protect" },
      { href: "/services/acronis-backup", label: "백업 복구검증 서비스" },
    ],
  },
};

export function ToolExplainer({ slug }: { slug: ToolSlug }) {
  const c = CONTENT[slug];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="bg-white border-t border-gray-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">{c.heading}</h2>
        <p className="mt-3 text-sm md:text-base text-gray-600 leading-relaxed">{c.lead}</p>

        <h3 className="mt-10 text-base font-semibold text-slate-900">진단이 확인하는 항목</h3>
        <dl className="mt-4 space-y-4">
          {c.covers.map((item) => (
            <div key={item.title} className="border-l-2 border-gray-200 pl-4">
              <dt className="text-sm font-medium text-slate-900">{item.title}</dt>
              <dd className="mt-1 text-sm text-gray-600 leading-relaxed">{item.desc}</dd>
            </div>
          ))}
        </dl>

        <h3 className="mt-10 text-base font-semibold text-slate-900">결과로 받는 것</h3>
        <ul className="mt-3 space-y-2">
          {c.outputs.map((o) => (
            <li key={o} className="text-sm text-gray-600 leading-relaxed">
              {o}
            </li>
          ))}
        </ul>

        <h3 className="mt-10 text-base font-semibold text-slate-900">이런 경우에 씁니다</h3>
        <ul className="mt-3 space-y-2">
          {c.audience.map((a) => (
            <li key={a} className="text-sm text-gray-600 leading-relaxed">
              {a}
            </li>
          ))}
        </ul>

        <h3 className="mt-10 text-base font-semibold text-slate-900">자주 묻는 질문</h3>
        <div className="mt-4 space-y-5">
          {c.faq.map((f) => (
            <div key={f.q}>
              <p className="text-sm font-medium text-slate-900">{f.q}</p>
              <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-10 text-base font-semibold text-slate-900">함께 보면 좋은 자료</h3>
        <ul className="mt-3 space-y-2">
          {c.related.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="text-sm text-blue-700 hover:text-blue-800 underline underline-offset-2"
              >
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
