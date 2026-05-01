import { NextResponse } from "next/server";

/**
 * API 에러 응답 헬퍼.
 *
 * 문제: 기존 코드는 Supabase·Postgres `error.message`를 그대로 응답에 노출 →
 *       스키마·제약조건·테이블명 정찰 가능 (Red Team HIGH 5번).
 *
 * 사용:
 *   if (error) return apiError(error, 400, "lead_save_failed");
 *
 * - 클라이언트에는 고정 문구 + 트레이스용 코드만 반환
 * - 서버 콘솔에는 원본 에러 풀 로깅 (운영 디버깅)
 */
export function apiError(
  err: unknown,
  status: 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500 = 400,
  code = "request_failed"
): NextResponse {
  const requestId = crypto.randomUUID().slice(0, 8);

  // 서버 로그: 원본 에러 풀 출력
  console.error(`[api-error] ${code} (${requestId})`, err);

  // 사용자 친화 메시지 (스키마 정보 노출 없음)
  const userMessages: Record<string, string> = {
    request_failed: "요청 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    invalid_input: "입력값이 올바르지 않습니다.",
    not_found: "요청하신 정보를 찾을 수 없습니다.",
    forbidden: "접근 권한이 없습니다.",
    unauthorized: "인증이 필요합니다.",
    conflict: "이미 처리된 요청입니다.",
    rate_limited: "요청이 너무 빈번합니다. 잠시 후 다시 시도해 주세요.",
    server_error: "일시적인 오류가 발생했습니다. 문제가 계속되면 contact@mlkit.co.kr로 알려주세요.",
  };

  const message = userMessages[code] || userMessages.request_failed;

  return NextResponse.json(
    { error: message, code, request_id: requestId },
    { status }
  );
}

/**
 * 입력 검증 실패용 — 사용자에게 어떤 필드가 문제인지 안전 메시지.
 */
export function validationError(
  field: string,
  reason: "missing" | "too_short" | "too_long" | "invalid"
): NextResponse {
  const reasons: Record<string, string> = {
    missing: "필수 항목이 누락되었습니다",
    too_short: "입력이 너무 짧습니다",
    too_long: "입력이 너무 깁니다",
    invalid: "형식이 올바르지 않습니다",
  };
  return NextResponse.json(
    {
      error: `${field}: ${reasons[reason]}`,
      code: "invalid_input",
    },
    { status: 400 }
  );
}
