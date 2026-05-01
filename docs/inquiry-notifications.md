# 상담 문의 알림 설정 가이드

`/contact` 폼 제출 시 운영자에게 알림을 보내는 방법.

## 동작 원리

1. 사용자가 `/contact` 폼 제출 → `POST /api/inquiries`
2. Supabase `leads` + `lead_extensions` 저장 (실패 시 사용자에게 에러 회신)
3. **`src/lib/notify.ts`가 알림 발송** (env 기반, 다중 채널 동시 시도)
4. 알림 실패는 swallow — DB 저장은 항상 성공

## 채널 옵션

### Option A — Webhook (권장, 가장 단순)

Slack/Discord/Telegram/Zapier/Make/n8n/IFTTT 등 어떤 webhook URL이든 지원.

**Vercel 환경변수** (Production·Preview·Development 모두):
```
INQUIRY_WEBHOOK_URL=https://hooks.slack.com/services/T...
```

**Slack 예시**:
1. Slack Workspace → Apps → Incoming Webhooks 추가
2. 알림 받을 채널 선택 → Webhook URL 복사
3. 위 환경변수에 붙여넣기

**Discord 예시**:
1. 서버 설정 → Integrations → Webhook 생성
2. Webhook URL 복사 → 환경변수에 등록

**Zapier/Make.com 예시** (이메일·SMS·Notion 등 다중 액션):
1. Zapier "Webhooks by Zapier" 트리거 (Catch Hook)
2. URL 복사 → 환경변수에 등록
3. 후속 액션: Email / Gmail / SMS / Slack 등 자유 조합

전송되는 JSON 형식:
```json
{
  "text": "[Myloket] 신규 상담 문의\n\n· 이름: ...\n· 이메일: ...\n...",
  "content": "(동일)",
  "inquiry": {
    "name": "...",
    "email": "...",
    "organization": "...",
    "department": "...",
    "phone": "...",
    "interestAreas": ["secure-workspace"],
    "message": "...",
    "source": "contact",
    "leadId": "uuid",
    "createdAt": "2026-05-01 14:32:10"
  }
}
```
- Slack은 `text` 필드 사용
- Discord는 `content` 필드 사용
- Zapier 등 일반 webhook은 `inquiry` 객체로 구조화 데이터 활용

### Option B — Resend (이메일 직접 발송)

[Resend.com](https://resend.com) — 무료 100통/일, 도메인 인증 후 운영용.

**환경변수**:
```
RESEND_API_KEY=re_xxx
INQUIRY_EMAIL_TO=contact@mlkit.co.kr
INQUIRY_EMAIL_FROM=noreply@mlkit.co.kr  # 선택, 미설정 시 noreply@mlkit.co.kr
```

발신 도메인은 Resend Dashboard에서 SPF/DKIM 설정 필요. 도메인 미인증 시 `onboarding@resend.dev`로만 발송 가능 (개발용).

### Option C — 둘 다 동시

위 두 옵션을 모두 설정하면 양쪽 모두 발송됨. 한쪽 실패해도 다른 쪽 정상 동작.

### Option D — 알림 미설정

환경변수 모두 미설정 → DB 저장만 정상 진행.
운영자는 `/admin/leads` 또는 `/admin/queue`에서 신규 문의 확인.

## Vercel 설정 절차

1. Vercel Dashboard → Project → Settings → Environment Variables
2. `INQUIRY_WEBHOOK_URL` 추가
   - Environment: Production · Preview · Development 모두 체크
   - Sensitive: ON (URL 자체가 비밀)
3. Redeploy 트리거 (env 변경 후 필수)

## 로컬 개발 테스트

`.env.local`에 추가 후 `npm run dev`:
```
INQUIRY_WEBHOOK_URL=https://webhook.site/xxx-xxx
```
[webhook.site](https://webhook.site) 같은 도구로 페이로드 미리 확인 가능.

## 알림 실패 시

- 모든 알림 실패는 console.warn으로 로깅 (Vercel Function Logs 확인)
- DB 저장은 정상 → `/admin/leads`에서 누락 없이 확인 가능
- 알림 채널 변경 시 환경변수 수정 + Redeploy

## 보안 권장

- Webhook URL은 Sensitive로 관리 (Slack URL 노출 시 누구나 채널에 메시지 전송 가능)
- Resend API Key는 반드시 Sensitive
- Webhook URL 노출 시 Slack/Discord에서 즉시 회전(재발급)
