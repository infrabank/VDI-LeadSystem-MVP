"use client";

import { useRef, useState } from "react";
import Link from "next/link";

/**
 * 설치 전 Before 측정 양식(HVMPortal/docs/plans/mods-implementation.md §1.3)을 고객이 스스로
 * 채우는 형태. 항목 문구는 그 표를 그대로 옮긴다. 값은 브라우저에만 있고 "보내기"를 누를 때만 전송한다.
 */
interface Item {
  id: string;
  label: string;
  method: string;
  unit: string;
  detail?: { label: string; placeholder: string };
}

const ITEMS: Item[] = [
  {
    id: "create-hands",
    label: "VM 1대 신규 생성 소요 (운영자 손이 가는 시간)",
    method: "요청 접수부터 사용자에게 전달까지 운영자가 콘솔을 조작한 시간의 합",
    unit: "분",
  },
  {
    id: "create-total",
    label: "VM 1대 신규 생성 총 소요 (대기 포함)",
    method: "접수부터 전달까지 경과 시간",
    unit: "분",
  },
  {
    id: "consoles",
    label: "신규 생성에 여는 관리 콘솔 수",
    method: "vCenter, AD, Horizon Console, IP 대장(엑셀 등), DNS, 기타",
    unit: "개",
    detail: { label: "콘솔 이름 열거", placeholder: "예: vCenter, AD 사용자 및 컴퓨터, Horizon Console, IP 대장 엑셀, DNS 관리자" },
  },
  {
    id: "steps",
    label: "신규 생성의 수작업 단계 수",
    method: "복제, 이름·IP 지정, 도메인 가입, 등록, 할당, 확인 등",
    unit: "단계",
    detail: { label: "단계 열거", placeholder: "예: 복제, 이름 지정, IP 지정, 도메인 가입, 풀 등록, 사용자 할당, 접속 확인" },
  },
  {
    id: "replace",
    label: "장애 VM 교체 소요",
    method: "위와 같은 방식으로 교체 1건",
    unit: "분",
  },
  {
    id: "retire",
    label: "VM 회수·삭제 소요",
    method: "회수 결정부터 vCenter·AD·IP 대장 정리까지",
    unit: "분",
  },
  {
    id: "monthly",
    label: "월간 건수",
    method: "최근 3개월 평균: 생성/교체/삭제/계정 작업",
    unit: "건",
    detail: { label: "작업 유형별 건수", placeholder: "예: 생성 12, 교체 3, 삭제 8, 계정 작업 20" },
  },
  {
    id: "mistakes",
    label: "최근 6개월 운영 실수 사례",
    method: "IP 중복, 이름 중복, 잘못된 대상 삭제, AD 객체 잔존 등",
    unit: "건",
    detail: { label: "내용", placeholder: "예: IP 중복 1건(신규 VM이 기존 서버 주소를 잡음), AD 컴퓨터 계정 잔존 다수" },
  },
  {
    id: "staff",
    label: "운영 담당 인원",
    method: "VDI 운영에 손이 가는 사람 수와 비율",
    unit: "명",
    detail: { label: "담당 비율", placeholder: "예: 2명, 각각 업무의 30% 정도" },
  },
];

type Basis = "" | "measured" | "estimated";

interface Row {
  value: string;
  basis: Basis;
  detail: string;
}

const POOL_TYPES = ["Manual / Full Clone", "Instant Clone", "혼합"] as const;

type Step = "form" | "submitting" | "done" | "error";

const inputClass = (invalid = false) =>
  `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
    invalid ? "border-red-400 bg-red-50/50" : "border-gray-300"
  }`;

export default function VdiOpsChecklistPage() {
  const [rows, setRows] = useState<Record<string, Row>>(() =>
    Object.fromEntries(ITEMS.map((i) => [i.id, { value: "", basis: "", detail: "" }])),
  );
  const [horizonVersion, setHorizonVersion] = useState("");
  const [poolType, setPoolType] = useState("");
  const [vmCount, setVmCount] = useState("");

  const [sendOpen, setSendOpen] = useState(false);
  const [organization, setOrganization] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const sendRef = useRef<HTMLDivElement>(null);

  function setRow(id: string, patch: Partial<Row>) {
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  const filledCount = ITEMS.filter((i) => rows[i.id].value.trim()).length;

  function basisLabel(b: Basis) {
    return b === "measured" ? "실측" : b === "estimated" ? "추정" : "미표기";
  }

  function buildMessage(): string {
    const lines = ["VDI 운영 진단 체크리스트", ""];
    lines.push("[환경]");
    lines.push(`- Horizon 버전: ${horizonVersion.trim() || "미입력"}`);
    lines.push(`- 풀 유형: ${poolType || "미입력"}`);
    lines.push(`- VM 대수: ${vmCount.trim() || "미입력"}`);
    lines.push("", "[측정값]");
    for (const item of ITEMS) {
      const r = rows[item.id];
      const v = r.value.trim() ? `${r.value.trim()} ${item.unit}` : "미입력";
      lines.push(`- ${item.label}: ${v} (${basisLabel(r.basis)})`);
      if (item.detail && r.detail.trim()) lines.push(`  ${item.detail.label}: ${r.detail.trim()}`);
    }
    return lines.join("\n");
  }

  function openSend() {
    setSendOpen(true);
    setTimeout(() => sendRef.current?.scrollIntoView({ block: "start", behavior: "smooth" }), 0);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const found: Record<string, string> = {};
    if (!organization.trim()) found.organization = "기관명을 입력해 주세요.";
    if (!name.trim()) found.name = "담당자 이름을 입력해 주세요.";
    if (!email.trim()) found.email = "이메일을 입력해 주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) found.email = "이메일 형식을 확인해 주세요.";
    if (!consent) found.consent = "개인정보 수집·이용 동의가 필요합니다.";
    setFieldErrors(found);
    if (Object.keys(found).length > 0) {
      const first = ["organization", "name", "email", "consent"].find((k) => found[k])!;
      setError(Object.keys(found).length === 1 ? found[first] : `입력을 확인해 주세요. ${Object.keys(found).length}개 항목이 남았습니다.`);
      document.getElementById(`cl-${first}`)?.focus();
      return;
    }

    setStep("submitting");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          organization: organization.trim(),
          interestAreas: ["vdiops"],
          message: buildMessage(),
          source: "vdi-ops-checklist",
          consentMarketing: false,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "전송에 실패했습니다.");
      setStep("error");
    }
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-slate-900 border-b border-slate-800 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Tools · VDIOps
          </p>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-white mb-5 leading-[1.15] kr-keep-all">
            VDI 운영 진단 체크리스트
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed kr-keep-all">
            Horizon Manual 풀에서 VM 한 대를 만들고 교체하는 데 지금 몇 분이 걸리고, 콘솔을 몇 개
            열며, 단계가 몇 개인지 적는 양식입니다. 설치 뒤에는 잴 수 없는 값이라 지금 재 두는
            것이 의미가 있습니다. 실제 작업 1건을 옆에서 지켜보며 시각을 적는 방식이 가장 정확하고,
            기억에 의존한 값은 추정으로 표시합니다.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="hidden print:block mb-6">
          <h1 className="text-2xl font-bold text-gray-900">VDI 운영 진단 체크리스트</h1>
          <p className="text-xs text-gray-600">(주)마이로켓 · myloket.co.kr/tools/vdi-ops-checklist</p>
        </div>

        {/* 환경 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">환경</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label htmlFor="env-horizon" className="block text-xs font-medium text-gray-600 mb-1">Horizon 버전</label>
              <input id="env-horizon" type="text" value={horizonVersion} onChange={(e) => setHorizonVersion(e.target.value)} placeholder="예: 8.12" className={inputClass()} />
            </div>
            <div>
              <label htmlFor="env-pool" className="block text-xs font-medium text-gray-600 mb-1">풀 유형</label>
              <select id="env-pool" value={poolType} onChange={(e) => setPoolType(e.target.value)} className={`${inputClass()} bg-white`}>
                <option value="">선택</option>
                {POOL_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="env-vm" className="block text-xs font-medium text-gray-600 mb-1">VM 대수</label>
              <input id="env-vm" type="text" inputMode="numeric" value={vmCount} onChange={(e) => setVmCount(e.target.value)} placeholder="예: 300" className={inputClass()} />
            </div>
          </div>
        </section>

        {/* 측정 항목 */}
        <section className="mb-8">
          <div className="flex items-end justify-between gap-4 mb-3">
            <h2 className="text-lg font-bold text-gray-900">측정 항목</h2>
            <p className="text-xs text-gray-500 print:hidden" aria-live="polite">
              {filledCount} / {ITEMS.length} 항목 입력
            </p>
          </div>
          <ol className="space-y-3">
            {ITEMS.map((item, idx) => {
              const r = rows[item.id];
              return (
                <li key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-start">
                    <div className="lg:col-span-6">
                      <p className="text-sm font-semibold text-gray-900 kr-keep-all">
                        <span className="text-gray-400 mr-1.5">{String(idx + 1).padStart(2, "0")}</span>
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 kr-keep-all">{item.method}</p>
                    </div>
                    <div className="lg:col-span-3">
                      <label htmlFor={`v-${item.id}`} className="block text-xs font-medium text-gray-600 mb-1">
                        값 ({item.unit})
                      </label>
                      <input
                        id={`v-${item.id}`}
                        type="text"
                        inputMode="decimal"
                        value={r.value}
                        onChange={(e) => setRow(item.id, { value: e.target.value })}
                        className={inputClass()}
                      />
                    </div>
                    <fieldset className="lg:col-span-3">
                      <legend className="block text-xs font-medium text-gray-600 mb-1">추정 / 실측</legend>
                      <div className="flex gap-2">
                        {(["measured", "estimated"] as const).map((b) => (
                          <label
                            key={b}
                            className={`flex-1 text-center px-3 py-2 rounded-lg border text-sm cursor-pointer select-none ${
                              r.basis === b
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`b-${item.id}`}
                              value={b}
                              checked={r.basis === b}
                              onChange={() => setRow(item.id, { basis: b })}
                              className="sr-only"
                            />
                            {basisLabel(b)}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    {item.detail && (
                      <div className="lg:col-span-12">
                        <label htmlFor={`d-${item.id}`} className="block text-xs font-medium text-gray-600 mb-1">
                          {item.detail.label}
                        </label>
                        <input
                          id={`d-${item.id}`}
                          type="text"
                          value={r.detail}
                          onChange={(e) => setRow(item.id, { detail: e.target.value })}
                          placeholder={item.detail.placeholder}
                          className={inputClass()}
                        />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-xs text-gray-500 kr-keep-all">
            신규 생성 소요, 교체 소요, 회수·삭제 소요 세 값은 VDIOps 도입 뒤 월간 보고서의 수작업
            기준값이 됩니다. 기준값이 없으면 절감 시간은 계산하지 않습니다.
          </p>
        </section>

        {/* 행동 */}
        <div className="flex flex-col sm:flex-row gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-6 py-3 bg-white border border-gray-400 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold text-sm"
          >
            인쇄 · PDF 저장
          </button>
          <button
            type="button"
            onClick={openSend}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold text-sm"
          >
            마이로켓에 보내기
          </button>
          <Link
            href="/products/vdiops"
            className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 inline-flex items-center"
          >
            VDIOps 제품 소개
          </Link>
        </div>

        {/* 보내기 */}
        {sendOpen && (
          <div ref={sendRef} className="mt-8 scroll-mt-20 print:hidden">
            {step === "done" ? (
              <div className="bg-white rounded-xl border border-gray-300 p-6 sm:p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2 kr-keep-all">체크리스트를 보냈습니다</h2>
                <p className="text-sm text-gray-600 kr-keep-all">
                  1영업일 안에 담당 엔지니어가 결과를 정리한 A4 한 장과 함께 회신합니다.
                </p>
              </div>
            ) : (
              <form noValidate onSubmit={handleSend} className="bg-gray-50 rounded-xl border border-gray-200 p-5 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-gray-900">보내는 사람</h2>
                <p className="text-sm text-gray-600 kr-keep-all">
                  위에 적은 값이 그대로 전달됩니다. 회신은 현재 절차의 단계 수, 콘솔 수, 소요 시간,
                  최근 오류를 정리한 A4 한 장입니다.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {(
                    [
                      { key: "organization", label: "기관명", value: organization, set: setOrganization, type: "text" },
                      { key: "name", label: "담당자", value: name, set: setName, type: "text" },
                      { key: "email", label: "이메일", value: email, set: setEmail, type: "email" },
                    ] as const
                  ).map((f) => (
                    <div key={f.key}>
                      <label htmlFor={`cl-${f.key}`} className="block text-sm font-medium text-gray-700 mb-1.5">
                        {f.label} <span className="text-red-600" aria-hidden="true">*</span>
                      </label>
                      <input
                        id={`cl-${f.key}`}
                        type={f.type}
                        value={f.value}
                        onChange={(e) => f.set(e.target.value)}
                        required
                        aria-invalid={!!fieldErrors[f.key]}
                        aria-describedby={fieldErrors[f.key] ? `cl-${f.key}-error` : undefined}
                        className={`${inputClass(!!fieldErrors[f.key])} bg-white`}
                      />
                      {fieldErrors[f.key] && (
                        <p id={`cl-${f.key}-error`} className="mt-1.5 text-xs text-red-700">{fieldErrors[f.key]}</p>
                      )}
                    </div>
                  ))}
                </div>
                <label
                  className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg cursor-pointer bg-white ${
                    fieldErrors.consent ? "border border-red-300" : "border border-gray-200"
                  }`}
                >
                  <input
                    id="cl-consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    aria-invalid={!!fieldErrors.consent}
                    className="mt-0.5 w-6 h-6 flex-shrink-0 accent-gray-900"
                  />
                  <span className="text-xs sm:text-sm text-gray-700 leading-relaxed kr-keep-all">
                    <strong className="text-gray-900">[필수]</strong> 개인정보 수집·이용 및 국외이전(위탁)에 동의합니다.
                    <span className="block text-2xs text-gray-500 mt-1">
                      수집 항목: 기관명·담당자·이메일·체크리스트 입력값 · 이용 목적: 진단 결과 회신
                      · 보관 기간: 상담 완료 후 1년 · 국외이전: Supabase·Vercel·Resend(미국)에 위탁합니다.
                      <Link href="/legal/privacy" target="_blank" className="text-gray-900 underline ml-1">전체 처리방침 보기</Link>
                    </span>
                  </span>
                </label>
                {fieldErrors.consent && <p className="px-1 text-xs text-red-700">{fieldErrors.consent}</p>}
                {error && (
                  <div role="alert" className="px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-800 kr-keep-all">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={step === "submitting"}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {step === "submitting" ? "전송 중..." : "체크리스트 보내기"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
