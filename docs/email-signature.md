# 이메일 서명 — Myloket 표준 템플릿

> 모든 외부 메일 발신 시 사용. 직원·파트너 공통 양식.
> 작성: 2026-05-01 · 최종 갱신: 2026-06-10 (중소기업 전산 통합 유지보수 포지션·blue 단일 브랜드 색·'가상 데스크톱(VDI)' 병기 반영)

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
㈜마이로켓 (Myloket Inc.) — 전산유지보수 · 백업·보안 · 가상 데스크톱(VDI) 기술지원

☎ 010-3861-8079   📧 jhw@mlkit.co.kr
🌐 myloket.co.kr
─────────────
```

### HTML
```html
<table style="border-collapse:collapse;font-family:'Pretendard Variable',-apple-system,'Segoe UI',Roboto,sans-serif;font-size:13px;color:#374151;line-height:1.55">
  <tr>
    <td style="padding-top:8px;border-top:2px solid #1d4ed8">
      <div style="font-weight:600;color:#101828;font-size:14px">제현우 <span style="color:#9ca3af;font-weight:400">|</span> 대표 · 수석 기술지원 엔지니어</div>
      <div style="color:#6b7280;font-size:12px;margin-top:2px">㈜마이로켓 (Myloket Inc.) — 전산유지보수 · 백업·보안 · 가상 데스크톱(VDI) 기술지원</div>
      <div style="margin-top:6px;font-size:12px">
        <span style="color:#374151">☎ 010-3861-8079</span>
        <span style="color:#d1d5db;margin:0 6px">·</span>
        <a href="mailto:jhw@mlkit.co.kr" style="color:#1d4ed8;text-decoration:none">jhw@mlkit.co.kr</a>
        <span style="color:#d1d5db;margin:0 6px">·</span>
        <a href="https://myloket.co.kr" style="color:#1d4ed8;text-decoration:none">myloket.co.kr</a>
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
서버부터 PC까지, 회사 전산 한 곳에서 관리

☎ 010-3861-8079   📧 jhw@mlkit.co.kr
🌐 myloket.co.kr

▸ 전산통합유지보수 — PC·서버·네트워크·백업 정기 점검과 장애 대응
▸ 백업·보안 점검 — Acronis 백업 운영 + 사고 전 실제 복구 가능성 확인
▸ 가상 데스크톱(VDI) 기술지원 — Citrix·Omnissa Horizon 구축·장애 대응

▸ 서비스 전체 보기: myloket.co.kr/#services
─────────────────────────────
```

### HTML
```html
<table style="border-collapse:collapse;font-family:'Pretendard Variable',-apple-system,'Segoe UI',Roboto,sans-serif;font-size:13px;color:#374151;line-height:1.6;max-width:560px">
  <tr>
    <td style="padding:12px 0 4px;border-top:2px solid #1d4ed8">
      <div style="font-weight:600;color:#101828;font-size:15px">
        제현우 <span style="color:#9ca3af;font-weight:400;font-size:13px">(Je Hyunwoo)</span>
        <span style="color:#9ca3af;font-weight:400">|</span>
        <span style="color:#4b5563;font-weight:500">대표 · 수석 기술지원 엔지니어</span>
      </div>
      <div style="color:#6b7280;font-size:12px;margin-top:2px">㈜마이로켓 <span style="color:#9ca3af">(Myloket Inc.)</span></div>
      <div style="color:#1d4ed8;font-size:12px;font-weight:600;margin-top:4px">서버부터 PC까지, 회사 전산 한 곳에서 관리</div>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 0">
      <table style="border-collapse:collapse;font-size:12px">
        <tr>
          <td style="padding-right:12px;color:#6b7280">☎</td>
          <td style="padding-right:16px"><span style="color:#374151">010-3861-8079</span></td>
          <td style="padding-right:12px;color:#6b7280">📧</td>
          <td><a href="mailto:jhw@mlkit.co.kr" style="color:#1d4ed8;text-decoration:none">jhw@mlkit.co.kr</a></td>
        </tr>
        <tr>
          <td style="padding-right:12px;color:#6b7280">🌐</td>
          <td colspan="3"><a href="https://myloket.co.kr" style="color:#1d4ed8;text-decoration:none">myloket.co.kr</a></td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 0;border-top:1px solid #e5e7eb;font-size:12px">
      <div style="margin-bottom:3px"><span style="color:#1d4ed8">▸</span> <strong style="color:#101828;font-weight:600">전산통합유지보수</strong> <span style="color:#6b7280">— PC·서버·네트워크·백업 정기 점검과 장애 대응</span></div>
      <div style="margin-bottom:3px"><span style="color:#1d4ed8">▸</span> <strong style="color:#101828;font-weight:600">백업·보안 점검</strong> <span style="color:#6b7280">— Acronis 백업 운영 + 사고 전 실제 복구 가능성 확인</span></div>
      <div><span style="color:#1d4ed8">▸</span> <strong style="color:#101828;font-weight:600">가상 데스크톱(VDI) 기술지원</strong> <span style="color:#6b7280">— Citrix·Omnissa Horizon 구축·장애 대응</span></div>
    </td>
  </tr>
  <tr>
    <td style="padding-top:6px;font-size:11px;color:#9ca3af">
      ▸ 서비스 전체 보기 <a href="https://myloket.co.kr/#services" style="color:#1d4ed8;text-decoration:underline;text-underline-offset:2px">myloket.co.kr/#services</a>
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
서버부터 PC까지, 회사 전산 한 곳에서 관리
전산유지보수 · 백업·보안 · 가상 데스크톱(VDI) 기술지원 — 상담부터 작업까지 직접 대응 · 공공·연구기관 10여 곳 + 중소기업 전산환경 유지보수 실적
═════════════════════════════════════

제현우 (Je Hyunwoo) | 대표 · 수석 기술지원 엔지니어 / CEO · Principal Engineer
☎ 010-3861-8079   📧 jhw@mlkit.co.kr
🌐 https://myloket.co.kr

──────────────────────
3 Services
──────────────────────

[전산통합유지보수 — IT Maintenance]
PC · 서버 · 네트워크 · 프린터 · 백업 정기 점검과 장애 대응 — 점검표·운영 보고서 제공
→ myloket.co.kr/services/it-maintenance

[백업·보안 점검 — Acronis Cyber Protect]
백업 정책·실패 이력 점검 + 사고 전 실제 복구 가능성 확인
→ myloket.co.kr/services/acronis-backup

[가상 데스크톱(VDI) 기술지원 — Citrix · Omnissa Horizon]
VDI 구축·전환·장애 대응 — 접속·인증서·UAG/Gateway·FSLogix 분석, SI 프로젝트 협업
→ myloket.co.kr/services/vdi-support

──────────────────────
무료 진단·계산 도구
──────────────────────
✓ 백업·사이버복원력 자가 진단
✓ 백업 ROI 계산기
✓ VDI 운영 ROI 시뮬레이션
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
공공·연구기관 10여 곳 + 중소기업 전산환경 유지보수 실적

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
- **기밀 메일 처리**: Rich 변형 하단은 기밀 고지만 둠 — "발신 전용" 문구 금지 (영업·상담 메일에서 회신을 차단하는 카피)
- **주기적 갱신**: 솔루션 추가·진단 도구 추가 시 Rich 변형의 도구·템플릿 목록 업데이트

---

## 메인 색상 — Blue(#1d4ed8) 단일 브랜드 액센트

**blue-700 #1d4ed8** 단일 액센트 — 서명 상단 라인·링크·서비스 블록 모두 동일 (2026-06-10 홈페이지 2색 체계 통일). 명함·홈페이지와 같은 시각 시그니처. 서비스별 색 구분(blue/emerald/indigo)과 purple 브랜드 색은 폐기됨.

| 요소 | 컬러 | 용도 |
|---|---|---|
| 상단 라인·링크·▸·서비스 블록 보더 | `#1d4ed8` (blue-700) | 브랜드 시그니처 |
| 서비스 블록 배경 | `#f8fafc` (slate-50) | 중립 배경 |

---

## Plain Text fallback

HTML이 차단되거나 단순 텍스트 환경(터미널 메일, Plain Text 강제 클라이언트 등)을 위해, 위 각 변형의 Plain Text 섹션을 **Multipart MIME**의 text/plain part로 함께 발송 권장. Outlook·Gmail은 자동 처리.
