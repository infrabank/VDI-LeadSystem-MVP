# 명함 디자인 — Myloket 표준

> 한국 표준 90×50mm · 양면 · Hashnode editorial-tech 톤
> 작성: 2026-05-01 · 최종 갱신: 2026-06-04 (전산유지보수·백업·VDI 3-사업 포지션 반영)

## 파일 위치

- **미리보기·인쇄용**: `public/business-card.html`
- 배포 후 접근: `https://myloket.co.kr/business-card.html`

## 디자인 개요

### 앞면 (Front)
- **좌측 3색 라인** (blue → emerald → indigo) — 3사업 시그니처
- 좌상단: `Myloket ●` wordmark (dot은 purple)
- 우상단: `IT Maintenance · Acronis Backup / Citrix · Horizon VDI Support` (영문 부제)
- 중앙: **이름 한글 (18pt) → Je Hyunwoo → 대표 · 수석 기술지원 엔지니어 / CEO · Principal Engineer**
- 좌하단: 연락처 stack (M / T / E)
- 우하단: ㈜마이로켓 · Myloket Inc. · myloket.co.kr (purple)

### 뒷면 (Back)
- **다크 배경 (#0f172a)** — Hashnode 다크 모드 톤
- 코너 그라데이션 글로우 (purple + indigo)
- 상단: `Myloket ●` (dot은 purple) + 한글 부제 (`전산유지보수 · 백업·복구보안 · VDI 전문 기술지원`)
- 중앙: **3 사업 카드** (사이트 3-사업 순, 위에서부터)
  - 전산통합유지보수 (IT Maintenance) — `#5288ff` blue
  - Acronis 백업·복구보안 (Cyber Protect) — `#34d399` emerald
  - VDI 기술지원 및 유지보수 (Citrix · Omnissa Horizon) — `#818cf8` indigo
- 하단: `Citrix · Omnissa · VMware · Acronis · myloket.co.kr`

> **벤더 표기 주의**: Omnissa는 VMware EUC 분사로 Horizon·Workspace ONE을 가져갔다. VMware는 ESXi/vSphere 등 인프라만 계속 제공한다. 명함에는 Omnissa로 표기하고, VMware는 인프라 표기 시에만 명시(이메일 서명 Rich 변형 footer 참조).

## 사용 방법

### 1. 본인 정보 교체
`public/business-card.html`에서 다음 5가지 토큰을 본인 정보로 바꾸세요:

| 토큰 | 위치 | 예시 |
|---|---|---|
| `제현우` | front-name | 본인 한글명 |
| `Je Hyunwoo` | front-name-en | 영문 표기 |
| `대표 · 수석 기술지원 엔지니어` | front-role | 한글 직책 |
| `CEO · Principal Engineer` | front-role-en | 영문 직책 |
| `jhw@mlkit.co.kr` | contact-stack | 본인 이메일 |
| `010-3861-8079`, `070-8015-8087` | contact-stack | 모바일/사무실 |

> 동일 디자인을 직원·파트너용으로 복제할 때 위 5~6가지 토큰만 바꾸면 됩니다.

### 2. PDF 출력

1. 브라우저로 `public/business-card.html` 열기
2. `Ctrl+P` (Mac: `⌘+P`)
3. 대상: **PDF로 저장**
4. 용지 크기: **사용자 정의 90×50mm** 또는 **A4 (인쇄소가 자르기)**
5. 여백: **없음**
6. 배경 그래픽: **켜기** (다크 배경 인쇄용 필수)
7. **저장**

### 3. 인쇄소 입고

- 한국 인쇄소(레드프린팅·성원애드피아·애드피아 등) 표준 양식
- 입고 파일: PDF 1개 (앞면·뒷면 page 1·2)
- 사이즈: 90×50mm
- 재단 여유(bleed): 인쇄소가 자체 +3mm 처리하므로 본 디자인 그대로 입고
- 표면 가공: **무광 코팅** 또는 **매트 라미네이팅** 권장 (editorial 톤 유지)
- 종이: **250~300g/m² 아트지** 또는 **모조지** (취향)
- 컬러 모드: sRGB → 인쇄소 RGB→CMYK 자동 변환 요청

> ⚠️ **HTML/PDF만으로 인쇄 시 주의사항이 있습니다**. 다음 섹션 "PDF 변환·CMYK·폰트 실무 가이드"를 반드시 읽어주세요.

### 3-1. PDF 변환·CMYK·폰트 실무 가이드

HTML로 만든 PDF는 다음 3가지 이슈가 있습니다. 옵션 A/B/C 중 본인 상황에 맞춰 선택하세요.

#### 실무 이슈 3가지

**이슈 1: CMYK 색상 변환**
- HTML로 만든 PDF는 **항상 RGB(sRGB)** — 인쇄기는 CMYK 잉크라 자동 변환 시 채도 높은 색은 탁해짐
- 위험 색상 (1순위 메인이 purple로 변경됨):
  - `#7c3aed` (purple, 메인) → 어두운 보라가 회보라 가능성
  - `#c084fc` (밝은 퍼플) → 회보라 가능성
  - `#34d399` (에메랄드) → 회녹색 가능성
  - `#5288ff` (블루) → 채도 손실

**이슈 2: 폰트 임베딩**
- PDF에 폰트가 임베드되지 않으면 인쇄소 환경에서 자동 fallback → 디자인 깨짐
- Chrome으로 PDF 저장 시 **시스템에 깔려있는 폰트만 임베드됨**
- `Pretendard Variable` 미설치 환경에서 PDF 만들면 다른 폰트로 임베드 → 인쇄소에서 다시 깨짐

**이슈 3: 재단 여유(Bleed) 부재**
- 표준 명함 90×50mm는 인쇄 후 재단 시 흰 테두리 가능성
- 인쇄소가 자체 +3mm 처리하지만, **다크 배경(뒷면 #0f172a)이라 위험**

---

#### 옵션 A: 인쇄소 자동 변환에 맡기기 (가장 쉬움)

**적합 대상**: 색 정확도 100% 중요하지 않음, 비용 절감, 빠른 입고
**예상 비용**: 100매 1.5~3만원 (인쇄비 외 비용 0)

**준비**:
1. **Pretendard Variable 시스템 설치** (필수)
   - https://github.com/orioncactus/pretendard → Releases → 최신 버전 압축 풀고 Windows/Mac 설치
   - 미설치 시 폰트 fallback으로 디자인 깨짐
2. **Chrome으로 PDF 저장**
   - `business-card.html` 열기 → `Ctrl+P` (Mac: `⌘+P`)
   - 대상: **PDF로 저장**
   - 용지 크기: **사용자 정의 90×50mm** (또는 A4)
   - 여백: **없음**
   - 배경 그래픽: **켜기** (필수 — 다크 배경 인쇄)
3. PDF 파일 확인 — 폰트가 깨져 보이면 폰트 설치 누락

**입고 시 명시 요청** (이메일·메모로 함께 전달):
```
1. RGB → CMYK 자동 변환 부탁드립니다 (sRGB 입력)
2. 다크 배경(#0f172a)이라 재단 여유 +3mm 자체 처리 부탁드립니다
3. Pretendard Variable 폰트 임베드된 PDF입니다 (확인 부탁)
4. 표면: 무광 코팅 또는 매트 라미네이팅
5. 종이: 250~300g/m² 아트지
6. 메인 컬러: purple #7c3aed (브랜드 시그니처 — 좌측 라인·dot·글로우) — 채도 손실 최소화 부탁
```

**중요**: 본판 인쇄 전 **샘플 100매 시범 인쇄** → 색·폰트 확인 후 본판 진행 권장.

---

#### 옵션 B: PDF 후처리 (Adobe Acrobat Pro)

**적합 대상**: 색 정확도 중요, 자체 처리 의지
**예상 비용**: Acrobat Pro 7일 무료 trial (또는 월 $14.99)

**절차**:
1. 옵션 A처럼 PDF 생성
2. **Adobe Acrobat Pro 다운로드** (7일 무료 trial)
3. PDF 열기 → **도구 → 인쇄 제작 → 색상 변환**
   - 변환 프로파일: **ISO Coated v2** (한국 인쇄 표준) 또는 **Japan Color 2001 Coated**
   - 모든 객체 CMYK로 변환
4. **폰트 outline 처리** (도구 → 인쇄 제작 → 평면화)
   - 폰트 깨짐 100% 방지 — 텍스트가 패스로 변환됨
5. **PDF/X-1a 표준으로 저장** (다른 이름으로 저장 → PDF/X-1a 선택)
6. 인쇄소 입고 (CMYK 변환·outline 처리 완료 PDF)

**장점**: 색·폰트 거의 완벽
**단점**: 매월 구독 부담, 학습 비용

---

#### 옵션 C: 디자인 외주 (가장 안전)

**적합 대상**: 명함 다량 인쇄·장기 사용, 브랜드 정확도 최우선
**예상 비용**: 디자이너 외주 5~15만원 (1회), 이후 인쇄만 진행

**절차**:
1. 현재 `business-card.html`을 디자이너에게 전달 (참고 디자인)
2. "이 디자인 그대로 Illustrator/InDesign으로 재제작" 의뢰
3. **CMYK 모드 + 재단 여유 +3mm + outline 처리된 PDF/X-1a** 받기
4. 인쇄소 입고

**장점**: 직원 늘어도 같은 디자인 일괄 적용 가능, 브랜드 정확도 보장
**단점**: 초기 비용 발생

---

#### 한국 인쇄소 권장 (1인 기업 기준)

| 인쇄소 | 특징 | 추천 옵션 |
|---|---|---|
| **레드프린팅** (redprinting.co.kr) | 디자이너 친화, RGB→CMYK 자동 변환 안내 명시 | A 또는 B |
| **성원애드피아** (sungwon.com) | 100매 1.5~3만원, 빠른 납기 | A |
| **애드피아** (adpia.co.kr) | 10년+ 운영, 안정적 | A |
| **브랜디드디자인** | 디자인 + 인쇄 통합 의뢰 가능 | C |

#### 권장 진행 순서

1. **Pretendard Variable 시스템 설치** (필수, 무료)
2. **옵션 A**로 샘플 100매 먼저 인쇄
3. 색·폰트 확인:
   - 만족 → 그대로 본판 인쇄
   - 불만족 → 옵션 B로 후처리 PDF 다시 만들어 본판 인쇄
   - 장기 사용·다량 → 옵션 C로 외주 디자인 의뢰

---

### 4. 가격 가이드 (한국 인쇄소 기준)

- 100매: 약 1.5~3만원 (양면 컬러, 무광 라미네이팅 기준)
- 500매: 약 3~5만원
- 1000매: 약 5~8만원
- 직원 수만큼 배수 추가

## 디자인 변형

### 다크 → 라이트 스왑

뒷면을 라이트 톤으로 바꾸려면 `.back` 클래스 background를 `#fff`로, 텍스트 색상은 본문 톤으로 조정. 단 다크 백 + 라이트 프론트 조합이 더 임팩트 있음.

### 솔루션 압축 (3개 또는 2개)

뒷면 3 사업이 빡빡하게 느껴지면 `.practices` 안의 3개 중 일부만 남기고 그 색상으로 좌측 라인도 통일. 영업 담당자별 강조 사업 다르게 가능. **단 VDI 기술지원 블록은 가능한 유지** (마이로켓 차별화 포인트).

### QR 코드 추가

명함 뒷면 우측 하단에 본인 LinkedIn·웹사이트 QR을 넣고 싶다면:
- 외부 도구(qr-code-generator 등)로 PNG 생성
- 본인 단독 명함이라면 직접 HTML에 `<img>` 추가
- 단, 회사 표준 명함 디자인은 QR 없이 통일 권장 (이메일 서명에서 처리)

## 디자인 원칙

- **이미지 미사용** — 텍스트·CSS만으로 시그니처 구성 (수정·복제 단순화)
- **3 사업 시각화** — 뒷면 3개 카드의 색상이 site-config의 톤과 일치 (blue/emerald/indigo — 전산통합유지보수 → 백업 → VDI 순)
- **표지 면으로 wordmark** — 상의 주머니에서 절반만 보여도 브랜드 식별
- **연락처 우선 vs 회사 우선** — 좌측 개인 / 우측 회사 명확 분리
- **한글·영문 동시 노출** — 한국·국제 모두 대응. 이름·직책 모두 양쪽 표기.
- **벤더 정확성** — Omnissa(EUC 분사 후 Horizon·Workspace ONE) vs VMware(ESXi/vSphere 인프라) 분리

## 갱신·관리

- 솔루션 추가·이름 변경 시 본 파일과 `email-signature.md`·`site-config.ts` 함께 갱신
- 다음 명함 인쇄는 회사 정보(주소·전화번호) 확정 후 일괄 진행 권장
- 직원·파트너 명함 마스터 템플릿으로 본 파일 사용 — 5~6 토큰만 교체하면 일괄 발주 가능

## 관련 자산

- 이메일 서명: `docs/email-signature.md`
- 회사 정보 단일 출처: `src/lib/site-config.ts`
- 파트너 로고 가이드: `public/partners/README.md`
- 회사 로고 (favicon·헤더용): `public/logo.png`
