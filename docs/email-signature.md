# 이메일 서명 — Myloket 표준 템플릿

> 모든 외부 메일 발신 시 사용. 직원·파트너 공통 양식.
> 작성: 2026-05-01 · 최종 갱신: 2026-05-02 (4 솔루션 리포지셔닝 반영)

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
제현우 | CEO · Founder
㈜마이로켓 (Myloket Inc.)

📧 jhw@mlkit.co.kr
🌐 myloket.co.kr
─────────────
```

### HTML
```html
<table style="border-collapse:collapse;font-family:'Pretendard Variable',-apple-system,'Segoe UI',Roboto,sans-serif;font-size:13px;color:#374151;line-height:1.55">
  <tr>
    <td style="padding-top:8px;border-top:2px solid #1d52de">
      <div style="font-weight:600;color:#101828;font-size:14px">제현우 <span style="color:#9ca3af;font-weight:400">|</span> CEO · Founder</div>
      <div style="color:#6b7280;font-size:12px;margin-top:2px">㈜마이로켓 (Myloket Inc.)</div>
      <div style="margin-top:6px;font-size:12px">
        <a href="mailto:jhw@mlkit.co.kr" style="color:#1d52de;text-decoration:none">jhw@mlkit.co.kr</a>
        <span style="color:#d1d5db;margin:0 6px">·</span>
        <a href="https://myloket.co.kr" style="color:#1d52de;text-decoration:none">myloket.co.kr</a>
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
제현우 (Je Hyunwoo) | CEO · Founder
㈜마이로켓 (Myloket Inc.)
VDI · MFA · Data Protection Solutions

📧 jhw@mlkit.co.kr   ☎ 010-3861-8079
🌐 myloket.co.kr

▸ VDI 워크스페이스 (Citrix · VMware · Omnissa · DaaS)
▸ MFA · 접근통제 (Microsoft Entra · 라온시큐어 GPKI)
▸ 백업 · EDR (Acronis Cyber Protect)
▸ 융합 맞춤 제안 (VDI+MFA+백업 단일 책임)

▸ VDI 보안 준비도 자가 진단: myloket.co.kr/tools
─────────────────────────────
```

### HTML
```html
<table style="border-collapse:collapse;font-family:'Pretendard Variable',-apple-system,'Segoe UI',Roboto,sans-serif;font-size:13px;color:#374151;line-height:1.6;max-width:560px">
  <tr>
    <td style="padding:12px 0 4px;border-top:2px solid #1d52de">
      <div style="font-weight:600;color:#101828;font-size:15px">
        제현우 <span style="color:#9ca3af;font-weight:400;font-size:13px">(Je Hyunwoo)</span>
        <span style="color:#9ca3af;font-weight:400">|</span>
        <span style="color:#4b5563;font-weight:500">CEO · Founder</span>
      </div>
      <div style="color:#6b7280;font-size:12px;margin-top:2px">㈜마이로켓 <span style="color:#9ca3af">(Myloket Inc.)</span></div>
      <div style="color:#1d52de;font-size:11px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;margin-top:4px">VDI · MFA · Data Protection Solutions</div>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 0">
      <table style="border-collapse:collapse;font-size:12px">
        <tr>
          <td style="padding-right:12px;color:#6b7280">📧</td>
          <td style="padding-right:16px"><a href="mailto:jhw@mlkit.co.kr" style="color:#1d52de;text-decoration:none">jhw@mlkit.co.kr</a></td>
          <td style="padding-right:12px;color:#6b7280">☎</td>
          <td><span style="color:#374151">010-3861-8079</span></td>
        </tr>
        <tr>
          <td style="padding-right:12px;color:#6b7280">🌐</td>
          <td colspan="3"><a href="https://myloket.co.kr" style="color:#1d52de;text-decoration:none">myloket.co.kr</a></td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 0;border-top:1px solid #e5e7eb;font-size:12px">
      <div style="margin-bottom:3px"><span style="color:#1d52de">▸</span> <strong style="color:#101828;font-weight:600">VDI 워크스페이스</strong> <span style="color:#6b7280">— Citrix · VMware · Omnissa · DaaS 전환</span></div>
      <div style="margin-bottom:3px"><span style="color:#4f46e5">▸</span> <strong style="color:#101828;font-weight:600">MFA · 접근통제</strong> <span style="color:#6b7280">— Microsoft Entra · 라온시큐어 (GPKI)</span></div>
      <div style="margin-bottom:3px"><span style="color:#059669">▸</span> <strong style="color:#101828;font-weight:600">백업 · EDR</strong> <span style="color:#6b7280">— Acronis Cyber Protect</span></div>
      <div><span style="color:#7c3aed">▸</span> <strong style="color:#101828;font-weight:600">융합 맞춤 제안</strong> <span style="color:#6b7280">— VDI+MFA+백업 단일 책임</span></div>
    </td>
  </tr>
  <tr>
    <td style="padding-top:6px;font-size:11px;color:#9ca3af">
      ▸ VDI 보안 준비도 자가 진단 <a href="https://myloket.co.kr/tools/risk-assessment" style="color:#1d52de;text-decoration:underline;text-underline-offset:2px">myloket.co.kr/tools</a>
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
VDI · MFA · Data Protection Solutions
═════════════════════════════════════

제현우 (Je Hyunwoo) | CEO · Founder
📧 jhw@mlkit.co.kr   ☎ 010-3861-8079
🌐 https://myloket.co.kr

──────────────────────
4 Solutions
──────────────────────

[VDI 워크스페이스 — VDI Delivery]
Citrix · VMware Horizon · Omnissa Workspace ONE
DaaS 전환 (AVD · Windows 365) 자문
→ myloket.co.kr/practices/vdi-workspace

[MFA · 접근통제 — MFA & Access]
Microsoft Entra ID · 라온시큐어 OneAccess (한국 공공 GPKI)
원격근무·외부 협력사 접근통제
→ myloket.co.kr/practices/mfa-access

[백업 · EDR — Cyber Protect]
Acronis Cyber Protect 백업 · DR · EDR · 안티 랜섬웨어
MSP 운영 (Cyber Protect Cloud)
→ myloket.co.kr/practices/data-protection

[융합 맞춤 제안 — Integrated Solution]
VDI + MFA + 백업 통합 설계 · 단일 책임 운영(MSP)
→ myloket.co.kr/practices/managed-integration

──────────────────────
무료 진단·계산 도구
──────────────────────
✓ VDI 보안 준비도 진단 (8영역 28문항)
✓ VDI 역할 재정의 진단
✓ VDI 운영 ROI 시뮬레이션
✓ 백업·사이버복원력 자가 진단
✓ 백업 ROI 계산기

→ myloket.co.kr/tools

──────────────────────
파트너십
──────────────────────
Citrix · VMware · Omnissa · Microsoft · Acronis
공공·연구기관과 민간 기업 운영 실적

═════════════════════════════════════
```

### HTML

```html
<table style="border-collapse:collapse;font-family:'Pretendard Variable',-apple-system,'Segoe UI',Roboto,sans-serif;font-size:13px;color:#374151;line-height:1.6;max-width:580px;border-top:3px solid #1d52de;border-bottom:1px solid #e5e7eb">
  <!-- Brand header -->
  <tr>
    <td style="padding:14px 0 4px">
      <div style="font-size:18px;font-weight:600;color:#101828;letter-spacing:-0.01em">㈜마이로켓 <span style="color:#9ca3af;font-size:14px;font-weight:400">(Myloket Inc.)</span></div>
      <div style="color:#1d52de;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin-top:4px">VDI · MFA · Data Protection Solutions</div>
    </td>
  </tr>

  <!-- Person -->
  <tr>
    <td style="padding:10px 0;border-top:1px solid #e5e7eb">
      <div style="font-size:14px;color:#101828;font-weight:600">제현우 <span style="color:#9ca3af;font-weight:400;font-size:12px">Je Hyunwoo</span></div>
      <div style="color:#4b5563;font-size:12px;margin-top:1px">CEO · Founder</div>
      <div style="margin-top:6px;font-size:12px">
        <a href="mailto:jhw@mlkit.co.kr" style="color:#1d52de;text-decoration:none">jhw@mlkit.co.kr</a>
        <span style="color:#d1d5db;margin:0 6px">·</span>
        <span style="color:#374151">010-3861-8079</span>
        <span style="color:#d1d5db;margin:0 6px">·</span>
        <a href="https://myloket.co.kr" style="color:#1d52de;text-decoration:none">myloket.co.kr</a>
      </div>
    </td>
  </tr>

  <!-- 4 Solutions -->
  <tr>
    <td style="padding:12px 0 4px;border-top:1px solid #e5e7eb">
      <div style="color:#9ca3af;font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px">4 Solutions</div>
      <table style="border-collapse:collapse;width:100%">
        <tr>
          <td style="padding:7px 12px 7px 10px;border-left:3px solid #1d52de;background:#f8fafc;font-size:12px;border-radius:0 4px 4px 0">
            <div style="font-weight:600;color:#101828;margin-bottom:2px">VDI 워크스페이스 <span style="color:#6b7280;font-weight:400;font-size:11px">VDI Delivery</span></div>
            <div style="color:#4b5563;line-height:1.5">Citrix · VMware Horizon · Omnissa · DaaS 전환 자문</div>
            <a href="https://myloket.co.kr/practices/vdi-workspace" style="color:#1d52de;text-decoration:none;font-size:11px">myloket.co.kr/practices/vdi-workspace →</a>
          </td>
        </tr>
        <tr><td style="height:5px"></td></tr>
        <tr>
          <td style="padding:7px 12px 7px 10px;border-left:3px solid #4f46e5;background:#eef2ff;font-size:12px;border-radius:0 4px 4px 0">
            <div style="font-weight:600;color:#101828;margin-bottom:2px">MFA · 접근통제 <span style="color:#6b7280;font-weight:400;font-size:11px">MFA &amp; Access</span></div>
            <div style="color:#4b5563;line-height:1.5">Microsoft Entra ID · 라온시큐어 OneAccess (한국 공공 GPKI)</div>
            <a href="https://myloket.co.kr/practices/mfa-access" style="color:#4f46e5;text-decoration:none;font-size:11px">myloket.co.kr/practices/mfa-access →</a>
          </td>
        </tr>
        <tr><td style="height:5px"></td></tr>
        <tr>
          <td style="padding:7px 12px 7px 10px;border-left:3px solid #059669;background:#f0fdf4;font-size:12px;border-radius:0 4px 4px 0">
            <div style="font-weight:600;color:#101828;margin-bottom:2px">백업 · EDR <span style="color:#6b7280;font-weight:400;font-size:11px">Cyber Protect</span></div>
            <div style="color:#4b5563;line-height:1.5">Acronis Cyber Protect 백업 · DR · EDR · 안티 랜섬웨어</div>
            <a href="https://myloket.co.kr/practices/data-protection" style="color:#059669;text-decoration:none;font-size:11px">myloket.co.kr/practices/data-protection →</a>
          </td>
        </tr>
        <tr><td style="height:5px"></td></tr>
        <tr>
          <td style="padding:7px 12px 7px 10px;border-left:3px solid #7c3aed;background:#faf5ff;font-size:12px;border-radius:0 4px 4px 0">
            <div style="font-weight:600;color:#101828;margin-bottom:2px">융합 맞춤 제안 <span style="color:#6b7280;font-weight:400;font-size:11px">Integrated Solution</span></div>
            <div style="color:#4b5563;line-height:1.5">VDI + MFA + 백업 통합 설계 · 단일 책임 운영(MSP)</div>
            <a href="https://myloket.co.kr/practices/managed-integration" style="color:#7c3aed;text-decoration:none;font-size:11px">myloket.co.kr/practices/managed-integration →</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Tools -->
  <tr>
    <td style="padding:12px 0 4px;border-top:1px solid #e5e7eb">
      <div style="color:#9ca3af;font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px">Free Diagnostic Tools</div>
      <div style="font-size:12px;color:#374151;line-height:1.7">
        VDI 보안 준비도 진단 · VDI 역할 재정의 · VDI 운영 ROI ·<br>
        백업·사이버복원력 진단 · 백업 ROI 계산기
      </div>
      <a href="https://myloket.co.kr/tools" style="color:#1d52de;text-decoration:none;font-size:12px;font-weight:500;display:inline-block;margin-top:6px">myloket.co.kr/tools →</a>
    </td>
  </tr>

  <!-- Partners -->
  <tr>
    <td style="padding:10px 0;border-top:1px solid #e5e7eb;font-size:11px;color:#6b7280">
      <strong style="color:#374151">Partners</strong> &nbsp;Citrix · VMware · Omnissa · Microsoft · Acronis
      <span style="color:#d1d5db;margin:0 6px">·</span>
      공공·연구기관과 민간 기업 운영 실적
    </td>
  </tr>

  <!-- Footer disclaimer -->
  <tr>
    <td style="padding:8px 0 12px;font-size:10px;color:#9ca3af;line-height:1.5">
      본 메일은 발신 전용입니다. 본 메일과 첨부 파일에는 기밀 정보가 포함되어 있을 수 있으며, 의도된 수신자가 아닌 경우 폐기 후 발신자에게 알려주시기 바랍니다.
    </td>
  </tr>
</table>
```

---

## 등록 절차

### Outlook (Windows / Mac)

1. **파일** → **옵션** → **메일** → **서명**
2. **새로 만들기** → 이름 입력 (예: "Myloket - Standard")
3. 본 문서의 **Standard HTML** 섹션 코드 전체 복사
4. 서명 편집 영역에 붙여넣기 (Outlook이 HTML 자동 렌더)
5. 새 메시지·회신 모두 기본 서명으로 지정 → **확인**

> Outlook은 일부 CSS(예: `border-radius`)를 무시할 수 있음. 가장 호환성 높은 변형은 **Compact**.

### Gmail

1. **설정** (⚙️) → **모든 설정 보기** → **일반** 탭
2. **서명** 섹션 → **새로 만들기** → 이름 입력
3. 다른 탭에서 본 문서 **HTML 변형**을 브라우저로 열기 (또는 `public/email-signature-preview.html` 직접 사용)
4. 렌더된 결과를 **Ctrl+A** 전체 선택 → 복사
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
- **개인 정보 교체**: `제현우`, `Je Hyunwoo`, `jhw@mlkit.co.kr`, `010-3861-8079`, 직책 4곳을 본인 정보로 교체
- **기밀 메일 처리**: Rich 변형 하단의 발신 전용 안내문은 회사 정책에 맞게 조정
- **주기적 갱신**: 솔루션 추가·진단 도구 추가 시 Rich 변형의 도구 목록 업데이트

---

## Plain Text fallback

HTML이 차단되거나 단순 텍스트 환경(터미널 메일, Plain Text 강제 클라이언트 등)을 위해, 위 각 변형의 Plain Text 섹션을 **Multipart MIME**의 text/plain part로 함께 발송 권장. Outlook·Gmail은 자동 처리.
