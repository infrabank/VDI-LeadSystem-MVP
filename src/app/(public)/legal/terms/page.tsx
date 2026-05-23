import Link from "next/link";
import { company, companyLegal } from "@/lib/site-config";

export const metadata = {
  title: `이용약관 | ${company.name}`,
  description: `${company.legalName} 웹사이트 이용약관.`,
};

const EFFECTIVE_DATE = "2026-05-01";

export default function TermsPage() {
  return (
    <article className="reading-prose mx-auto px-4 sm:px-6 py-10 md:py-16">
      <p className="text-xs text-gray-500 mb-2">
        <Link href="/" className="hover:text-blue-600">홈</Link>
        <span className="mx-2 text-gray-300">/</span>
        Legal · 이용약관
      </p>
      <h1 className="text-display text-3xl sm:text-4xl font-semibold text-gray-900 mb-3 leading-[1.15]">
        이용약관
      </h1>
      <p className="text-sm text-gray-500 mb-8 kr-keep-all">
        시행일: {EFFECTIVE_DATE} · {company.legalName} ({company.legalNameEn}) — 이하 &quot;회사&quot;
      </p>

      <div className="prose">
        <h2>제1조 (목적)</h2>
        <p>
          본 약관은 {company.legalName}이 운영하는 {company.domain}({company.name}, 이하 &quot;사이트&quot;)에서 제공하는 콘텐츠·진단 도구·상담 문의 등 서비스 이용에 관한 사항을 정함을 목적으로 합니다.
        </p>

        <h2>제2조 (서비스 내용)</h2>
        <ul>
          <li>VDI 및 백업 기술지원 관련 콘텐츠 제공 (Citrix Virtual Apps and Desktops · Omnissa Horizon · Acronis Cyber Protect 등)</li>
          <li>유지보수·장애 대응·복구검증 문의 접수 및 회신</li>
          <li>기술 상담 및 프로젝트 협업 문의 대응</li>
          <li>필요한 경우 진단 도구 또는 리포트(웹·PDF) 제공</li>
          <li>기타 회사가 추가로 제공하는 부가 서비스</li>
        </ul>

        <h2>제3조 (이용자 의무)</h2>
        <p>이용자는 다음 행위를 하여서는 안 됩니다:</p>
        <ul>
          <li>타인의 개인정보·이메일을 도용한 진단·문의 제출</li>
          <li>사이트의 보안·정상 운영을 방해하는 행위 (자동화 봇·스팸 포함)</li>
          <li>저작권·지적재산권을 침해하는 행위</li>
          <li>법령·공서양속에 반하는 게시물·정보 전송</li>
        </ul>

        <h2>제4조 (지적재산권)</h2>
        <p>
          사이트에 게시된 콘텐츠·진단 로직·리포트 양식 등 지적재산권은 회사에 귀속됩니다. 이용자는 회사의 사전 서면 동의 없이 이를 복제·배포·전송할 수 없습니다. 단 개인적·비영리적 참고 목적의 인용은 출처 명시 시 허용됩니다.
        </p>

        <h2>제5조 (서비스 제한·중단)</h2>
        <p>
          회사는 다음 경우 사전 통지 없이 서비스를 일시 중단할 수 있습니다: (1) 시스템 점검·업그레이드, (2) 통신 장애·천재지변, (3) 법령·정부 명령에 따른 조치. 부득이한 경우 사후 공지합니다.
        </p>

        <h2>제6조 (면책 조항)</h2>
        <ul>
          <li>회사는 진단 도구가 제공하는 결과·권고를 참고 자료로 제공하며, 이용자의 사업 의사결정에 대한 최종 책임은 이용자에게 있습니다.</li>
          <li>회사는 무료 서비스의 정확성·완전성·중단 없는 제공을 보증하지 않습니다.</li>
          <li>이용자가 사이트를 통해 얻은 정보를 활용하여 발생한 손해에 대해 회사는 책임지지 않습니다.</li>
        </ul>

        <h2>제7조 (개인정보 보호)</h2>
        <p>
          회사는 「개인정보 보호법」 등 관련 법령에 따라 이용자의 개인정보를 보호합니다. 자세한 내용은 <Link href="/legal/privacy">개인정보 처리방침</Link>을 참고하세요.
        </p>

        <h2>제8조 (분쟁 해결)</h2>
        <p>
          본 약관과 관련하여 분쟁이 발생한 경우 회사 본점 소재지
          {companyLegal.address && (
            <span> (<span className="text-gray-700">{companyLegal.address}</span>)</span>
          )}
          {" "}관할 법원을 1심 관할 법원으로 합니다. 단 이용자의 주소·거소가 명확한 소비자 분쟁의 경우 민사소송법에 따릅니다.
        </p>

        <h2>제9조 (약관 변경)</h2>
        <p>
          본 약관은 시행일부터 적용됩니다. 회사는 약관을 변경할 수 있으며, 변경 시 시행일 7일 전(이용자에게 불리한 변경의 경우 30일 전)까지 사이트에 공지합니다. 변경된 약관에 동의하지 않는 이용자는 서비스 이용을 중단할 수 있습니다.
        </p>

        <h2>제10조 (문의)</h2>
        <p>
          본 약관 또는 서비스에 관한 문의는 <a href={`mailto:${company.email}`}>{company.email}</a> 로 부탁드립니다.
        </p>
      </div>
    </article>
  );
}
