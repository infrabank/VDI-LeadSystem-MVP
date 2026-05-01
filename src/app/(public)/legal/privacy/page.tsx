import Link from "next/link";
import { company } from "@/lib/site-config";

export const metadata = {
  title: `개인정보 처리방침 | ${company.name}`,
  description: `${company.legalName} 개인정보 수집·이용·보관·파기 정책.`,
};

const EFFECTIVE_DATE = "2026-05-01";

export default function PrivacyPage() {
  return (
    <article className="reading-prose mx-auto px-4 sm:px-6 py-10 md:py-16">
      <p className="text-xs text-gray-500 mb-2">
        <Link href="/" className="hover:text-blue-600">홈</Link>
        <span className="mx-2 text-gray-300">/</span>
        Legal · 개인정보 처리방침
      </p>
      <h1 className="text-display text-3xl sm:text-4xl font-semibold text-gray-900 mb-3 leading-[1.15]">
        개인정보 처리방침
      </h1>
      <p className="text-sm text-gray-500 mb-8 kr-keep-all">
        시행일: {EFFECTIVE_DATE} · {company.legalName} ({company.legalNameEn}) — 이하 &quot;회사&quot;
      </p>

      <div className="prose">
        <h2>1. 수집하는 개인정보 항목</h2>
        <p>회사는 상담 문의·진단 도구 이용 과정에서 다음 항목을 수집합니다:</p>
        <ul>
          <li><strong>필수</strong>: 이름, 이메일</li>
          <li><strong>선택</strong>: 소속 기관·회사명, 부서·직책, 연락처(전화), 관심 영역, 문의 내용</li>
          <li><strong>자동 수집</strong>: 접속 IP, 쿠키, 접속 일시, 사용 브라우저(서비스 운영 통계 목적)</li>
        </ul>

        <h2>2. 개인정보 수집·이용 목적</h2>
        <ul>
          <li>상담 문의 회신 및 후속 미팅 일정 협의</li>
          <li>보안 워크스페이스·데이터 보호 관련 기술 자료·진단 리포트 제공</li>
          <li>진단 결과 분석 및 맞춤 권고 도출</li>
          <li>서비스 운영·통계 분석 (개인 식별 불가 형태)</li>
        </ul>

        <h2>3. 보유 및 이용 기간</h2>
        <p>
          이용 목적 달성 후 즉시 파기합니다. 단, 다음 경우 명시 기간 동안 보관합니다:
        </p>
        <ul>
          <li><strong>상담 문의 기록</strong>: 상담 완료 후 1년 (분쟁 대응 목적)</li>
          <li><strong>진단 결과·리포트</strong>: 발급일로부터 1년 (재발급 요청 대응)</li>
          <li><strong>마케팅 활용 동의</strong>: 동의 철회 시 또는 동의일로부터 2년 후 자동 파기</li>
          <li>관련 법령(전자상거래법·통신비밀보호법 등)에 따른 보존 의무 기간 동안</li>
        </ul>

        <h2>4. 개인정보의 제3자 제공</h2>
        <p>
          회사는 정보주체의 개인정보를 외부 제3자에게 제공하지 않습니다. 단 다음 경우 예외:
        </p>
        <ul>
          <li>정보주체가 사전 동의한 경우</li>
          <li>법령에 따라 수사기관·감독기관의 적법한 요청이 있는 경우</li>
        </ul>

        <h2>5. 개인정보 처리 위탁</h2>
        <p>회사는 서비스 운영을 위해 다음 업무를 위탁하고 있습니다:</p>
        <ul>
          <li><strong>Supabase Inc.</strong> — 데이터베이스·인증·스토리지 (위탁 업무: 정보 저장·관리)</li>
          <li><strong>Vercel Inc.</strong> — 웹 호스팅 (위탁 업무: 페이지 제공)</li>
          <li><strong>Resend / Slack 등 알림 서비스</strong> — 상담 알림 발송 (운영 시 별도 고지)</li>
        </ul>
        <p>
          위탁 받은 자는 정보주체의 개인정보를 위탁 업무 수행 목적 외로 사용·제공할 수 없으며, 위탁 종료 시 즉시 파기합니다.
        </p>

        <h2>6. 정보주체 권리</h2>
        <p>정보주체는 다음 권리를 행사할 수 있습니다:</p>
        <ul>
          <li>개인정보 열람·정정·삭제·처리 정지 요구</li>
          <li>마케팅 활용 동의 철회 (이메일 1회 회신으로 가능)</li>
          <li>개인정보 처리방침 위반에 대한 손해배상 청구</li>
        </ul>
        <p>
          권리 행사는{" "}
          <a href={`mailto:${company.email}`}>{company.email}</a>로 요청 시 지체 없이(통상 5영업일 내) 처리합니다.
        </p>

        <h2>7. 개인정보 안전성 확보 조치</h2>
        <ul>
          <li><strong>관리적 조치</strong>: 내부관리계획 수립·운영, 접근 권한 최소화</li>
          <li><strong>기술적 조치</strong>: HTTPS 전송 암호화, Supabase RLS(Row Level Security), MFA 적용</li>
          <li><strong>물리적 조치</strong>: 클라우드 공급자(Supabase·Vercel) 인증 데이터센터 사용 (SOC 2 Type II 등)</li>
        </ul>

        <h2>8. 쿠키 사용</h2>
        <p>
          회사는 서비스 이용 통계 분석을 위한 최소한의 쿠키만 사용하며, 마케팅 목적의 제3자 추적 쿠키는 사용하지 않습니다. 브라우저 설정에서 쿠키 차단이 가능합니다.
        </p>

        <h2>9. 개인정보보호 책임자</h2>
        <ul>
          <li>책임자: 개인정보보호 책임자(직책 추후 지정)</li>
          <li>연락처: <a href={`mailto:${company.email}`}>{company.email}</a></li>
        </ul>

        <h2>10. 권익침해 구제 방법</h2>
        <p>개인정보 침해 신고·상담은 다음 기관에 문의 가능합니다:</p>
        <ul>
          <li>개인정보보호위원회 (privacy.go.kr / ☎ 1833-6972)</li>
          <li>한국인터넷진흥원 개인정보침해신고센터 (privacy.kisa.or.kr / ☎ 118)</li>
          <li>경찰청 사이버수사국 (ecrm.cyber.go.kr / ☎ 182)</li>
        </ul>

        <h2>11. 처리방침 변경</h2>
        <p>
          본 처리방침은 시행일부터 적용됩니다. 법령·서비스 변경에 따라 개정되는 경우 최소 7일 전 공지합니다. 중대한 변경은 이메일로 사전 통지합니다.
        </p>
      </div>
    </article>
  );
}
