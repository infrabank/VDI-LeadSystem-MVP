# 이메일 서명 — Myloket 표준 템플릿

> 모든 외부 메일 발신 시 사용. 직원·파트너 공통 양식.
> 작성: 2026-05-01 · 최종 갱신: 2026-06-04 (전산유지보수·백업·VDI 3-사업 포지션 반영)

## 사용 가이드

- **Compact** — 일상 회신·짧은 메일
- **Standard** — 기본값 (대부분 권장)
- **Rich** — 최초 접촉·세일즈·프로모션 메일

각 변형 모두 HTML(이미지 없음·표 기반) + Plain Text 동시 제공. 클라이언트별 등록 절차는 마지막 섹션 참고.

> 미리보기 페이지: `public/email-signature-preview.html` (브라우저로 직접 열어서 확인)

---

## 1. Compact (일상용)

### Plain Text
```
─────────────
제현우 | 대표 · 수석 기술지원 엔지니어
㈜마이로켓 (Myloket Inc.) — 전산유지보수 · 백업·복구보안 · VDI 기술지원

📧 jhw@mlkit.co.kr
🌐 myloket.co.kr
─────────────
```

### HTML
```html
<table style="border-collapse:collapse;font-family:'Pretendard Variable',-apple-system,'Segoe UI',Roboto,sans-serif;font-size:13px;color:#374151;line-height:1.55">
  <tr>
    <td style="padding-top:8px;border-top:2px solid #7c3aed">
      <div style="font-weight:600;color:#101828;font-size:14px">제현우 <span style="color:#9ca3af;font-weight:400">|</span> 대표 · 수석 기술지원 엔지니어</div>
      <div style="color:#6b7280;font-size:12px;margin-top:2px">㈜마이로켓 (Myloket Inc.) — 전산유지보수 · 백업·복구보안 · VDI 기술지원</div>
      <div style="margin-top:6px;font-size:12px">
        <a href="mailto:jhw@mlkit.co.kr" style="color:#7c3aed;text-decoration:none">jhw@mlkit.co.kr</a>
        <span style="color:#d1d5db;margin:0 6px">·</span>
        <a href="https://myloket.co.kr" style="color:#7c3aed;text-decoration:none">myloket.co.kr</a>
      </div>
    </td>
  </tr>
</table>
```

---

## 2. Standard (기본·권장)

### Plain Text
```
─────────────────────────────
제현우 (Je Hyunwoo) | 대표 · 수석 기술지원 엔지니어
㈜마이로켓 (Myloket Inc.)
IT Maintenance · Acronis Backup · VDI Support

📧 jhw@mlkit.co.kr   ☎ 010-3861-8079
🌐 myloket.co.kr

▸ 전산통합유지보수 — PC·서버·네트워크·NAS·백업 운영 점검과 장애 대응
▸ Acronis 백업·복구보안 — 서버·PC 백업 + 실제 복구 가능성 검증
▸ VDI 기술지원 및 유지보수 — Citrix·Omnissa Horizon·VMware 운영장애 분석

▸ 서비스 전체 보기: myloket.co.kr/#services
─────────────────────────────
```

### HTML
```html
<table style="border-collapse:collapse;font-family:'Pretendard Variable',-apple-system,'Segoe UI',Roboto,sans-serif;font-size:13px;color:#374151;line-height:1.6;max-width:560px">
  <tr>
    <td style="padding:12px 0 4px;border-top:2px solid #7c3aed">
      <div style="font-weight:600;color:#101828;font-size:15px">
        제현우 <span style="color:#9ca3af;font-weight:400;font-size:13px">(Je Hyunwoo)</span>
        <span style="color:#9ca3af;font-weight:400">|</span>
        <span style="color:#4b5563;font-weight:500">대표 · 수석 기술지원 엔지니어</span>
      </div>
      <div style="color:#6b7280;font-size:12px;margin-top:2px">㈜마이로켓 <span style="color:#9ca3af">(Myloket Inc.)</span></div>
      <div style="color:#7c3aed;font-size:11px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;margin-top:4px">IT Maintenance · Acronis Backup · VDI Support</div>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 0">
      <table style="border-collapse:collapse;font-size:12px">
        <tr>
          <td style="padding-right:12px;color:#6b7280">📧</td>
          <td style="padding-right:16px"><a href="mailto:jhw@mlkit.co.kr" style="color:#7c3aed;text-decoration:none">jhw@mlkit.co.kr</a></td>
          <td style="padding-right:12px;color:#6b7280">☎</td>
          <td><span style="color:#374151">010-3861-8079</span></td>
        </tr>
        <tr>
          <td style="padding-right:12px;color:#6b7280">🌐</td>
          <td colspan="3"><a href="https://myloket.co.kr" style="color:#7c3aed;text-decoration:none">myloket.co.kr</a></td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 0;border-top:1px solid #e5e7eb;font-size:12px">
      <div style="margin-bottom:3px"><span style="color:#2563eb">▸</span> <strong style="color:#101828;font-weight:600">전산통합유지보수</strong> <span style="color:#6b7280">— PC·서버·네트워크·NAS·백업 운영 점검과 장애 대응</span></div>
      <div style="margin-bottom:3px"><span style="color:#059669">▸</span> <strong style="color:#101828;font-weight:600">Acronis 백업·복구보안</strong> <span style="color:#6b7280">— 서버·PC 백업 + 실제 복구 가능성 검증</span></div>
      <div><span style="color:#4f46e5">▸</span> <strong style="color:#101828;font-weight:600">VDI 기술지원 및 유지보수</strong> <span style="color:#6b7280">— Citrix·Omnissa Horizon·VMware 운영장애 분석</span></div>
    </td>
  </tr>
  <tr>
    <td style="padding-top:6px;font-size:11px;color:#9ca3af">
      ▸ 서비스 전체 보기 <a href="https://myloket.co.kr/#services" style="color:#7c3aed;text-decoration:underline;text-underline-offset:2px">myloket.co.kr/#services</a>
    </td>
  </tr>
</table>
```

---

## 3. Rich (최초 접촉·프로모션용)

### Plain Text
```
═════════════════════════════════════
㈜마이로켓 (Myloket Inc.)
IT Maintenance · Acronis Backup · VDI Support
전산유지보수 · Acronis 백업·복구보안 · Citrix·Omnissa Horizon VDI 기술지원 — 1인 직접 대응 · 공공·연구기관 10여 곳 운영·유지보수 실적
═════════════════════════════════════

제현우 (Je Hyunwoo) | 대표 · 수석 기술지원 엔지니어 / CEO · Principal Engineer
📧 jhw@mlkit.co.kr   ☎ 010-3861-8079
🌐 https://myloket.co.kr

──────────────────────
3 Services
──────────────────────

[전산통합유지보수 — IT Maintenance]
PC · 서버 · 네트워크 · NAS · 백업 운영 점검과 장애 대응
→ myloket.co.kr/services/it-maintenance

[Acronis 백업·복구보안 — Cyber Protect]
서버 · PC 백업 + 사고 시 실제 복구 가능성 검증
→ myloket.co.kr/services/acronis-backup

[VDI 기술지원 및 유지보수 — Citrix · Omnissa Horizon]
Citrix · Omnissa Horizon · VMware 운영장애 · UAG/Gateway · FSLogix 분석
→ myloket.co.kr/services/vdi-support

──────────────────────
무료 진단·계산 도구
──────────────────────
✓ VDI 운영 ROI 시뮬레이션
✓ 백업·사이버복원력 자가 진단
✓ 백업 ROI 계산기
✓ N²SF 정렬 진단 (8영역 28문항)
✓ N²SF 전환 준비도 (5섹션 15문항)
✓ VDI 역할 재정의 (9문항 4시나리오)

→ myloket.co.kr/tools

──────────────────────
산출물 템플릿 (무료 PDF)
──────────────────────
N²SF 사전진단 체크리스트 · VDI 의사결정 매트릭스 · 보안성 검토 대응 ·
착수보고서 · 현황분석서 · 위험분석서 · 전환 로드맵 · 운영계획서 · 검수 체크리스트

→ myloket.co.kr/resources/templates

──────────────────────
파트너십·인프라
──────────────────────
Partners: Citrix · Omnissa · Acronis
Infra:    VMware ESXi · vSphere
공공·연구기관 10여 곳 운영·유지보수 실적

═════════════════════════════════════
```

### HTML

`public/email-signature-preview.html`의 Rich 섹션 표 코드를 그대로 복사해 사용. (실제 사용 시에는 본 문서 본문 대신 미리보기 페이지에서 렌더된 결과를 복사)

---

## 등록 절차

### Outlook (Windows / Mac)

1. **파일** → **옵션** → **메일** → **서명**
2. **새로 만들기** → 이름 입력 (예: "Myloket - Standard")
3. `public/email-signature-preview.html`을 브라우저로 열고 원하는 변형의 표 영역 드래그·복사
4. 서명 편집 영역에 붙여넣기 (Outlook이 HTML 자동 렌더)
5. 새 메시지·회신 모두 기본 서명으로 지정 → **확인**

> Outlook은 일부 CSS(예: `border-radius`)를 무시할 수 있음. 가장 호환성 높은 변형은 **Compact**.

### Gmail

1. **설정** (⚙️) → **모든 설정 보기** → **일반** 탭
2. **서명** 섹션 → **새로 만들기** → 이름 입력
3. `public/email-signature-preview.html`을 브라우저로 열기
4. 원하는 변형의 표 전체 드래그(Ctrl+A 후 영역 조정) → 복사
5. Gmail 서명 영역에 붙여넣기 (Gmail이 서식 보존)
6. 페이지 하단 **변경사항 저장**

> Gmail은 외부 이미지를 차단할 수 있으므로 본 템플릿은 이미지 없이 설계됨.

### Apple Mail (macOS)

1. **Mail** → **환경설정** → **서명**
2. 좌측 메일함 선택 → **+** 클릭
3. 서명 이름 → **HTML 형식 사용** 체크 (없으면 plain text로 사용)
4. HTML 코드를 임시로 브라우저에서 렌더 → 복사 → Apple Mail에 붙여넣기

### Notion / Slack 등

- Plain Text 변형 사용
- Slack 프로필 → **Status** 또는 **About me**에 활용 가능

---

## 사용 시 주의

- **이미지 첨부 금지**: 외부 이미지(로고)는 일부 클라이언트에서 차단됨. 본 템플릿은 텍스트·CSS만 사용.
- **링크 절대 경로**: 모든 URL은 `https://myloket.co.kr/...` 절대 경로
- **개인 정보 교체**: `제현우`, `Je Hyunwoo`, `jhw@mlkit.co.kr`, `010-3861-8079`, 직책(`대표 · 수석 기술지원 엔지니어 / CEO · Principal Engineer`) 4곳을 본인 정보로 교체
- **기밀 메일 처리**: Rich 변형 하단의 발신 전용 안내문은 회사 정책에 맞게 조정
- **주기적 갱신**: 솔루션 추가·진단 도구 추가 시 Rich 변형의 도구·템플릿 목록 업데이트

---

## 메인 색상 — Purple(#7c3aed) 브랜드 액센트

**purple #7c3aed**는 마이로켓 브랜드 시그니처 액센트로 사용 — 서명 상단 라인·링크·전산통합유지보수 블록에 적용. 명함·홈페이지·OG 이미지 모두 동일한 시각 시그니처.

각 블록 액센트 컬러:
| 블록 | 컬러 | 용도 |
|---|---|---|
| 전산통합유지보수 | `#2563eb` (blue) | |
| Acronis 백업·복구보안 | `#059669` (emerald) | |
| VDI 기술지원 및 유지보수 | `#4f46e5` (indigo) | |
| (브랜드 라인·링크) | `#7c3aed` (purple) | 브랜드 시그니처 |

---

## Plain Text fallback

HTML이 차단되거나 단순 텍스트 환경(터미널 메일, Plain Text 강제 클라이언트 등)을 위해, 위 각 변형의 Plain Text 섹션을 **Multipart MIME**의 text/plain part로 함께 발송 권장. Outlook·Gmail은 자동 처리.
