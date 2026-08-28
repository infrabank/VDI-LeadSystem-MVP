import Link from "next/link";
import { company, companyLegal, hasPrivacyOfficer } from "@/lib/site-config";

export const metadata = {
  alternates: { canonical: "/legal/privacy" },
  title: "개인정보 처리방침",
  description: `${company.legalName} 개인정보 수집·이용·보관·파기 정책.`,
};

const EFFECTIVE_DATE = "2026-05-01";

export default function PrivacyPage() {
  return (
    <article className="reading-prose mx-auto px-4 sm:px-6 py-10 md:py-16">
      <p className="text-xs text-gray-500 mb-2">
        <Link href="/" className="inline-flex items-center min-h-6 px-2 -mx-2 hover:text-blue-700">홈</Link>
        <span aria-hidden="true" className="mx-2 text-gray-400">/</span>
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

        <h2>5. 개인정보 처리 위탁 및 국외 이전</h2>
        <p>회사는 서비스 운영을 위해 다음 업무를 국외 사업자에게 위탁하고 있습니다:</p>
        <table>
          <thead>
            <tr><th>수탁자</th><th>위탁 업무</th><th>이전 항목</th><th>이전 국가</th><th>이전 시점·방법</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Supabase Inc.</td>
              <td>데이터베이스·인증·스토리지</td>
              <td>이름·이메일·기관·부서·연락처·문의내용·진단 입력값·리포트</td>
              <td>미국 (AWS us-east, ap-northeast)</td>
              <td>HTTPS/TLS, 회원 가입·문의·진단 시점 즉시</td>
            </tr>
            <tr>
              <td>Vercel Inc.</td>
              <td>웹 호스팅·CDN·서버리스 함수</td>
              <td>접속 IP, 요청 메타데이터(헤더·UA), 폼 제출 본문</td>
              <td>미국·다국가 엣지 노드</td>
              <td>HTTPS/TLS, 페이지 접속 시점 즉시</td>
            </tr>
            <tr>
              <td>Resend</td>
              <td>이메일 발송 (상담 회신·알림)</td>
              <td>수신자 이메일, 메일 본문 (이름·기관 포함)</td>
              <td>미국</td>
              <td>HTTPS/API, 메일 발송 시점</td>
            </tr>
            <tr>
              <td>Slack / Discord webhook (운영 시)</td>
              <td>내부 상담 알림 (요약 정보만 송신)</td>
              <td>이름(첫글자+익명), 도메인, 기관 카테고리, 문의 ID</td>
              <td>미국</td>
              <td>HTTPS, 문의 접수 시점</td>
            </tr>
          </tbody>
        </table>
        <p className="text-sm">
          <strong>국외이전 이용자 권리</strong>: 정보주체는 개인정보보호법 §28의-8에 따라 국외이전을 거부할 권리가 있습니다.
          이전을 거부하시려면 본 사이트 회원 가입·문의·진단 도구 이용을 중단하시고 직접 이메일{" "}
          <a href={`mailto:${company.email}`}>{company.email}</a>로 상담을 요청해 주세요.
        </p>
        <p>
          위탁 받은 자는 정보주체의 개인정보를 위탁 업무 수행 목적 외로 사용·제공할 수 없으며, 위탁 종료 시 즉시 파기합니다.
          상기 수탁자 외 신규 위탁 발생 시 본 처리방침을 통해 사전 고지합니다.
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

        <h2>9. 개인정보보호 책임자 (개인정보보호법 §31)</h2>
        {hasPrivacyOfficer() ? (
          <ul>
            <li>책임자: <strong>{companyLegal.privacyOfficer.name}</strong> ({companyLegal.privacyOfficer.role})</li>
            <li>이메일: <a href={`mailto:${companyLegal.privacyOfficer.email}`}>{companyLegal.privacyOfficer.email}</a></li>
            {companyLegal.privacyOfficer.phone && (
              <li>전화: {companyLegal.privacyOfficer.phone}</li>
            )}
          </ul>
        ) : (
          <ul>
            <li>회사는 개인정보보호 책임자를 지정·운영하고 있으며, 책임자 정보는 본 처리방침에 갱신될 예정입니다.</li>
            <li>임시 연락처: <a href={`mailto:${company.email}`}>{company.email}</a></li>
            <li className="text-xs text-gray-500">※ 책임자 정보 갱신 전이라도 §10 권익침해 구제 기관(개인정보보호위·KISA)을 통해 권리 구제를 요청하실 수 있습니다.</li>
          </ul>
        )}

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
