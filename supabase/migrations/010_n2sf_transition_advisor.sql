-- =====================================================================
-- 010_n2sf_transition_advisor.sql
-- N²SF Transition Advisor — 공공기관 보안 전환 진단 모듈
-- 설계 문서: docs/02-design/features/n2sf-transition-advisor.design.md
-- =====================================================================

-- 1. leads.status enum 확장 (5상태 → 7상태)
--    기존 row의 값을 신규 매핑으로 데이터 이전 후 CHECK 재정의

-- 1-1. 기존 데이터 매핑 이전 (역호환)
UPDATE leads SET status = 'reviewing'         WHERE status = 'contacted';
UPDATE leads SET status = 'meeting_scheduled' WHERE status = 'qualified';
UPDATE leads SET status = 'won'               WHERE status = 'converted';
-- 'new', 'lost'는 그대로 유지

-- 1-2. 기존 CHECK 제거 후 신규 CHECK 추가
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'reviewing', 'meeting_scheduled', 'proposing', 'on_hold', 'won', 'lost'));

-- =====================================================================
-- 2. lead_extensions: 공공기관/B2B 확장 필드 (1:1)
-- =====================================================================
CREATE TABLE IF NOT EXISTS lead_extensions (
  lead_id uuid PRIMARY KEY REFERENCES leads(id) ON DELETE CASCADE,
  organization_name text,
  organization_type text CHECK (
    organization_type IS NULL OR organization_type IN
    ('central', 'local', 'public-corp', 'agency', 'private', 'other')
  ),
  department text,
  phone text,
  interest_area text[] DEFAULT '{}'::text[],
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_extensions_org_name_idx
  ON lead_extensions (organization_name);

-- updated_at 자동 갱신
DROP TRIGGER IF EXISTS lead_extensions_updated_at ON lead_extensions;
CREATE TRIGGER lead_extensions_updated_at
  BEFORE UPDATE ON lead_extensions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE lead_extensions ENABLE ROW LEVEL SECURITY;

-- 익명: INSERT만 허용 (리드 폼 제출 경로). SELECT는 차단.
CREATE POLICY "Public can insert lead extensions"
  ON lead_extensions FOR INSERT
  TO anon
  WITH CHECK (true);

-- 관리자: 전체 권한
CREATE POLICY "Admin can read lead extensions"
  ON lead_extensions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can update lead extensions"
  ON lead_extensions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================================
-- 3. lead_status_history: 상태 변경 이력 (N건)
-- =====================================================================
CREATE TABLE IF NOT EXISTS lead_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  note text,
  created_at timestamptz DEFAULT now(),
  created_by text
);

CREATE INDEX IF NOT EXISTS lead_status_history_lead_id_idx
  ON lead_status_history (lead_id, created_at DESC);

ALTER TABLE lead_status_history ENABLE ROW LEVEL SECURITY;

-- 익명 차단, 관리자만 read/insert
CREATE POLICY "Admin can read status history"
  ON lead_status_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert status history"
  ON lead_status_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =====================================================================
-- 4. sales_partner_notes: 자유 메모 (N건)
-- =====================================================================
CREATE TABLE IF NOT EXISTS sales_partner_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by text
);

CREATE INDEX IF NOT EXISTS sales_partner_notes_lead_id_idx
  ON sales_partner_notes (lead_id, created_at DESC);

ALTER TABLE sales_partner_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read partner notes"
  ON sales_partner_notes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert partner notes"
  ON sales_partner_notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can delete partner notes"
  ON sales_partner_notes FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================================
-- 5. content_items SEED — N²SF 콘텐츠 3건
--    type CHECK 제약: 'article' | 'case' | 'checklist' | 'comparison'
--    → 본 콘텐츠는 'article'로 분류, category='n2sf'로 그룹화
-- =====================================================================
INSERT INTO content_items (type, slug, title, excerpt, body_md, tags, category, status, published_at)
VALUES
(
  'article',
  'n2sf-overview',
  'N²SF란 무엇인가 — 공공기관 보안 전환의 새 표준',
  '망분리 19년 만의 대체 프레임워크. C/S/O 등급별 차등 보안의 핵심과 2026-05 시행 일정 정리.',
  $md$# N²SF란 무엇인가

**N²SF(National Network Security Framework, 국가 망 보안체계)**는 2007년부터 의무화된 망분리 정책을 19년 만에 대체·완화하기 위해 국가정보원이 주도해 만든 새 보안 프레임워크입니다.

## 핵심 변화: C/S/O 등급 차등 보안

기존: **모든 업무에 동일한 망분리 적용**

전환: **C(기밀) / S(민감) / O(공개) 3등급으로 분류 → 등급별 차등 통제**

| 등급 | 영역 | 통제 방향 |
|---|---|---|
| **C — 기밀** | 군·외교·국가 핵심 행정 | 기존 망분리·VDI·논리적 격리 그대로 유지 |
| **S — 민감** | 일반 업무 데이터 | VDI/RBI/DLP/DRM/ZTNA 조합으로 부분 대체 |
| **O — 공개** | 인터넷 활용·SaaS·협업 | 직접 인터넷·SaaS 접근 허용 |

## 핵심 일정

- **2025-09-30**: N²SF 1.0 정식판 공개 (보안통제 280여 개 / 정보서비스 모델 11종)
- **2026-04**: 국가 사이버보안 기본 지침 개정안 의견수렴
- **2026-05**: 개정 지침 시행 (예정) — N²SF 명문화, MFA·보안 예산 15%·인력 10% 의무화
- **2026년**: KISA 도입 지원 공모 45억 원 (6개 과제)
- **2027년**: 신규 정보화사업 N²SF 사양 발주 본격화

## 5단계 적용 절차

1. 준비 → 2. C/S/O 등급분류 → 3. 위협 식별 → 4. 보안대책 수립 → 5. 적절성 평가·조정

## 잘못된 통설

- ❌ "망분리는 폐지된다" → 정확히는 **‘대체·완화’**, 핵심 영역은 보존
- ❌ "VDI는 끝났다" → C/S 일부 영역에서는 오히려 강화
- ❌ "제로트러스트만 도입하면 끝" → N²SF는 절차·증적·운영체계까지 요구

## 시작점

기관 담당자라면 우선 **현재 환경의 전환 준비도 진단**부터 받아보시는 것을 권합니다.

[N²SF 전환 준비도 진단 시작 →](/diagnosis/n2sf-readiness)
$md$,
  ARRAY['n2sf', 'public-sector', 'zero-trust', 'overview'],
  'n2sf',
  'published',
  now()
),
(
  'article',
  'zero-trust-impact-public-vdi',
  '제로트러스트가 공공기관 VDI에 미치는 영향',
  '제로트러스트 전환이 VDI 운영에 미치는 4가지 영향과, C/S/O 등급별 VDI의 잔존·축소·보완 시나리오.',
  $md$# 제로트러스트가 공공기관 VDI에 미치는 영향

제로트러스트는 “모든 접근을 항상 검증”하는 원칙입니다. 공공기관 VDI 환경에서는 단순히 ‘보안 솔루션 교체’가 아니라 **업무환경 전반의 재설계**를 요구합니다.

## VDI에 미치는 4가지 영향

### 1. 접근 통제의 분산
기존 “VDI 안에 들어가면 다 통과”에서 → **세션·권한·디바이스·위치별 동적 검증**으로 전환됩니다.

### 2. 인증 체계의 강화
MFA(다중인증) 의무화. 특권 계정·관리자 권한 분리. 세션 자동 종료·재검증.

### 3. SaaS·생성형 AI의 직접 접근
N²SF O등급 영역에서는 **VDI 없이 SaaS·AI 직접 사용**이 허용되므로, VDI 사용 명분이 좁아집니다.

### 4. 로그·감사 가시성 강화
모든 접근에 대한 로그 보존, SIEM 연계, 정기 감사 리포트가 의무화 흐름입니다.

## VDI는 사라지지 않습니다

| 영역 | VDI의 위치 |
|---|---|
| **C등급 (기밀)** | 핵심 보안 통제 수단으로 유지·강화 |
| **S등급 (민감)** | RBI/DRM/ZTNA와 병행, 일부 잔존 |
| **O등급 (공개)** | DaaS·SaaS·브라우저 격리로 대체 가능 |

## 무엇을 준비해야 하나

1. **MFA·특권계정 통제** — 가장 빠른 수혜 영역
2. **마이크로세그멘테이션** — VDI 내·외 트래픽 분리
3. **로그·감사 통합** — 운영 증빙 자동화
4. **DaaS 마이그레이션 검토** — O등급 업무부터 단계적

## 실무 진단

VDI 환경이 어디에 위치하는지 알기 위해서는 **VDI 역할 재정의 진단**이 가장 빠릅니다.

[VDI 역할 재정의 진단 →](/diagnosis/vdi-transition)
$md$,
  ARRAY['zero-trust', 'vdi', 'n2sf', 'public-sector'],
  'n2sf',
  'published',
  now()
),
(
  'article',
  'vdi-disappear-or-relocate',
  'VDI는 사라지는가, 재배치되는가',
  '시장 신호 3가지와 4가지 재배치 시나리오. VDI를 버리지 말고 상위 보안 서비스로 재포장하는 전략.',
  $md$# VDI는 사라지는가, 재배치되는가

> 결론부터: **사라지지 않습니다. 다만 “모든 업무의 디폴트”에서 “일부 업무의 전용 도구”로 역할이 바뀝니다.**

## 시장 신호 3가지

### 1. 공공 VDI 시장은 ‘즉시 붕괴’가 아닌 ‘구조적 잠식’
N²SF는 망분리를 폐지하지 않습니다. 그러나 신규 발주는 C/S 영역에 집중되고, O 영역은 DaaS·SaaS·ZTNA로 분산됩니다.

### 2. VMware Broadcom 인수 후 라이선스 5~15배 인상
2024년 이후 라이선스 충격이 N²SF 전환과 맞물려 **‘VDI를 갱신할 것인가, 다른 모델로 갈 것인가’의 결정**을 모든 공공기관에 강요합니다.

### 3. 온북·DaaS 정책의 확장
행안부는 2027년까지 일반직 공무원 62.3만 명의 PC를 노트북·DaaS로 전환할 계획입니다.

## 4가지 재배치 시나리오

| 시나리오 | 권장 처방 |
|---|---|
| **유지 강화** | 현 VDI가 핵심 보안 통제 수단 → 운영 안정성 강화 |
| **제로트러스트 보완** | 제로트러스트 전환과 병행 → 인증/권한 연계 |
| **점진적 축소** | SaaS/브라우저 가능 업무 → VDI는 고위험 업무로 축소 |
| **재설계** | 비효율 구조 → 업무 재분류 후 단계적 재설계 |

내 환경이 어디에 해당하는지 알고 싶다면:

[VDI 역할 재정의 진단 →](/diagnosis/vdi-transition)

## 1인 사업자가 알려주는 솔직한 조언

- 갱신 시점이 2026-05 이후라면 **자동으로 N²SF 사양으로 재발주**됩니다.
- 단순 ‘VDI 회사’ 포지션은 2027 하반기부터 입찰 자격에서 밀릴 가능성이 높습니다.
- 그러나 **기존 VDI 운영 경험은 N²SF 전환기에 오히려 자산**입니다. 단, 추가 역량(IAM/PAM/ZTNA/감사) 확장이 필요합니다.

VDI를 버리지 마세요. **상위 보안 서비스로 재포장**하세요.
$md$,
  ARRAY['vdi', 'n2sf', 'transition', 'strategy'],
  'n2sf',
  'published',
  now()
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================================
-- 끝
-- =====================================================================
