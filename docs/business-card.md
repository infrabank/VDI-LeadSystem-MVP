# 명함 디자인 — Myloket 표준

> 한국 표준 90×50mm · 양면 · Hashnode editorial-tech 톤
> 작성: 2026-05-01

## 파일 위치

- **미리보기·인쇄용**: `public/business-card.html`
- 배포 후 접근: `https://myloket.co.kr/business-card.html`

## 디자인 개요

### 앞면 (Front)
- **좌측 indigo+emerald 라인 강조** — 2 Practice 색상 결합 시각 시그니처
- 좌상단: `Myloket ●` wordmark
- 우상단: `Enterprise Workspace Security · Data Protection` (영문 부제)
- 중앙: **이름 한글 (18pt) → Hong Gildong → 직책**
- 좌하단: 연락처 stack (M / T / E)
- 우하단: ㈜마이로켓 · Myloket Inc. · myloket.co.kr

### 뒷면 (Back)
- **다크 배경 (#0f172a)** — Hashnode 다크 모드 톤
- 코너 그라데이션 글로우 (indigo + emerald)
- 상단: `Myloket ●` + 한글 부제
- 중앙: 2 Practice 카드
  - 보안 워크스페이스 (VDI Expert) — `#5288ff`
  - 데이터 보호 (Acronis Powered) — `#34d399`
- 하단: `VMware · Omnissa · Citrix · Acronis · myloket.co.kr`

## 사용 방법

### 1. 본인 정보 교체
`public/business-card.html`에서 다음 5가지 토큰을 본인 정보로 바꾸세요:

| 토큰 | 위치 | 예시 |
|---|---|---|
| `홍길동` | front-name | 본인 한글명 |
| `Hong Gildong` | front-name-en | 영문 표기 |
| `CEO · Founder` | front-role | 직책 |
| `hong@mlkit.co.kr` | contact-stack | 본인 이메일 |
| `010-XXXX-XXXX`, `02-XXXX-XXXX` | contact-stack | 모바일/사무실 |

> 동일 디자인을 직원·파트너용으로 복제할 때 위 5가지 토큰만 바꾸면 됩니다.

### 2. PDF 출력

1. 브라우저로 `public/business-card.html` 열기
2. `Ctrl+P` (Mac: `⌘+P`)
3. 대상: **PDF로 저장**
4. 용지 크기: **사용자 정의 90×50mm** 또는 **A4 (인쇄소가 자르기)**
5. 여백: **없음**
6. 배경 그래픽: **켜기** (다크 배경 인쇄용 필수)
7. **저장**

### 3. 인쇄소 입고

- 한국 인쇄소(애드피아·성원애드피아·포커스플레이트 등) 표준 양식
- 입고 파일: PDF 1개 (앞면·뒷면 page 1·2)
- 사이즈: 90×50mm
- 재단 여유(bleed): 인쇄소가 자체 +3mm 처리하므로 본 디자인 그대로 입고
- 표면 가공: **무광 코팅** 또는 **매트 라미네이팅** 권장 (editorial 톤 유지)
- 종이: **250~300g/m² 아트지** 또는 **모조지** (취향)
- 컬러 모드: sRGB → 인쇄소 RGB→CMYK 자동 변환 요청

### 4. 가격 가이드 (한국 인쇄소 기준)

- 100매: 약 1.5~3만원 (양면 컬러, 무광 라미네이팅 기준)
- 500매: 약 3~5만원
- 1000매: 약 5~8만원
- 직원 수만큼 배수 추가

## 디자인 변형

### 다크 → 라이트 스왑

뒷면을 라이트 톤으로 바꾸려면 `.back` 클래스 background를 `#fff`로, 텍스트 색상은 본문 톤으로 조정. 단 다크 백 + 라이트 프론트 조합이 더 임팩트 있음.

### Practice 단일 강조

특정 Practice 영업 담당자용으로 한쪽 Practice만 노출하려면 `.practices` 안의 둘 중 하나만 남기고 그 색상으로 좌측 라인도 통일.

### QR 코드 추가

명함 뒷면 우측 하단에 본인 LinkedIn·웹사이트 QR을 넣고 싶다면:
- 외부 도구(qr-code-generator 등)로 PNG 생성
- 본인 단독 명함이라면 직접 HTML에 `<img>` 추가
- 단, 회사 표준 명함 디자인은 QR 없이 통일 권장 (이메일 서명에서 처리)

## 디자인 원칙

- **이미지 미사용** — 텍스트·CSS만으로 시그니처 구성 (수정·복제 단순화)
- **2 Practice 시각화** — 앞면 좌측 라인이 indigo→emerald 60:40 분할
- **표지 면으로 wordmark** — 상의 주머니에서 절반만 보여도 브랜드 식별
- **연락처 우선 vs 회사 우선** — 좌측 개인 / 우측 회사 명확 분리
- **한글·영문 동시 노출** — 한국·국제 모두 대응

## 갱신·관리

- Practice 추가·이름 변경 시 본 파일과 `email-signature.md`·`site-config.ts` 함께 갱신
- 다음 명함 인쇄는 회사 정보(주소·전화번호) 확정 후 일괄 진행 권장
- 직원·파트너 명함 마스터 템플릿으로 본 파일 사용 — 5 토큰만 교체하면 일괄 발주 가능

## 관련 자산

- 이메일 서명: `docs/email-signature.md`
- 회사 정보 단일 출처: `src/lib/site-config.ts`
- 파트너 로고 가이드: `public/partners/README.md`
