# Vinchin 사용자 매뉴얼 한국어판 (vinchin.myloket.co.kr)

[helpcenter.vinchin.com](https://helpcenter.vinchin.com/) 의 **Vinchin Backup & Recovery** 사용자 매뉴얼(GitBook 정적 사이트, 317페이지)을
**구조·레이아웃·이미지는 원본 그대로 두고 텍스트만 한국어로 번역**하여 `vinchin.myloket.co.kr` 서브도메인으로
고객에게 제공하기 위한 정적 사이트입니다.

## 무엇이 번역되었나
- 본문(문단·목록·표·제목)과 사이드바 내비게이션, 페이지 제목/메타설명 → 한국어
- **영문 유지(의도된 설계)**: 화면 캡처(스크린샷)가 영문이므로 이를 따르는 UI 버튼/탭/메뉴 라벨(`Next`, `Backup`, `Restore`, `General Strategy` 등),
  제품·기능 고유명(VMware, vSphere, Hyper-V, Kubernetes …), 코드·명령어·경로·IP·버전.
- 이미지(스크린샷)는 **원본 그대로** 유지.
- 모든 페이지에 "Myloket(마이로켓) 제공 한글 번역본 + 원문(English) 링크" 안내 바를 삽입.

## 디렉터리
```
vinchin-docs/
├── site/                 # 영문 원본 미러 (mirror.mjs 산출물, git 제외, 재생성 가능)
├── dist/                 # 빌드된 한국어 정적 사이트 = 배포 대상 (git 제외, 재생성 가능)
├── i18n/
│   ├── strings.en.json   # 추출된 고유 번역 단위 4,525개 (소스)
│   ├── strings.ko.json   # ⭐ 한국어 번역 메모리 (핵심 산출물, git 포함)
│   └── batches/          # 번역 작업용 임시 배치 (git 제외)
├── tools/
│   ├── mirror.mjs        # 원본 사이트 미러링
│   ├── i18n.mjs          # extract / apply / assets (텍스트 추출·치환·에셋 복사)
│   ├── batch.mjs         # 번역 배치 생성/병합 (재개 가능, 태그 검증)
│   ├── brand.mjs         # 마이로켓 브랜딩·한글 폰트 주입
│   ├── build.mjs         # apply→assets→brand 일괄 빌드
│   └── serve.mjs         # 로컬 미리보기 서버
├── GLOSSARY.md           # 번역 용어집·규칙
└── TRANSLATE-INSTRUCTIONS.md  # (번역 에이전트용 지침)
```

## 빌드 (로컬)
```bash
npm ci
npm run mirror      # 원본 영문 사이트를 site/ 로 내려받기 (최초 1회 / 원본 갱신 시)
npm run build       # site/ + i18n/strings.ko.json → dist/ (번역 적용·에셋 복사·브랜딩)
npm run serve       # http://localhost:4180 로 dist/ 미리보기
```

## 배포 — Vercel (vinchin.myloket.co.kr)
`vercel.json`·`.vercelignore` 포함. **별도 Vercel 프로젝트**로 만들고 Root Directory를 `vinchin-docs`로 지정합니다.
빌드 시 Vercel이 원문을 다시 미러링(`npm run mirror`)하고 `i18n/strings.ko.json`(커밋된 한글 번역)을 적용해 `dist/`를 생성합니다.
(git에는 `tools/` + `i18n/strings.{en,ko}.json`만, `site/`·`dist/`는 클라우드에서 재생성)

**방법 A — CLI**
```bash
cd vinchin-docs
vercel login                 # 최초 1회 (브라우저 인증)
vercel --prod                # 프로젝트 생성/배포 (Root Directory = 현재 폴더)
vercel domains add vinchin.myloket.co.kr   # 또는 대시보드에서 도메인 추가
```

**방법 B — 대시보드(Git 연동, 권장)**
1. 이 저장소를 Vercel에 Import → **Root Directory = `vinchin-docs`**, Framework Preset = **Other**.
2. Build/Install/Output은 `vercel.json`이 지정 (Build: `npm run mirror && node tools/build.mjs`, Output: `dist`).
3. 배포 후 **Settings → Domains → `vinchin.myloket.co.kr` 추가**.

### DNS (myloket.co.kr 관리 콘솔)
Vercel이 도메인 추가 시 안내하는 값을 그대로 등록합니다(보통):
- `vinchin` 서브도메인 → **CNAME `cname.vercel-dns.com`** (또는 Vercel이 표시하는 A 레코드).
- 등록하면 Vercel이 자동으로 TLS 인증서를 발급합니다.

> 빌드가 매번 원문을 다시 받습니다. 원문 사이트 점검 등으로 미러링이 실패하면 배포가 실패할 수 있으니,
> 안정 배포가 필요하면 로컬에서 `npm run build` 후 `dist/`를 커밋하고 `vercel.json`의 `buildCommand`를 비워
> 정적 폴더만 발행하도록 바꿔도 됩니다.

## 원본 갱신 반영
Vinchin이 원문을 업데이트하면:
```bash
npm run mirror            # 최신 원문 다시 미러링
npm run extract           # 새 번역 단위 추출 (strings.en.json 갱신)
npm run batch make 120    # 미번역분만 배치 생성 → 번역 → npm run batch merge
npm run build             # 재빌드
```
기존 번역(`strings.ko.json`)은 그대로 재사용되고 **새로 추가/변경된 문장만** 번역하면 됩니다.

## ⚠️ 라이선스·저작권 안내
이 사이트는 Vinchin의 공식 매뉴얼을 **번역·재배포**합니다. 고객 대상 정식 서비스로 운영하기 전,
파트너/총판 계약상 **문서 한국어화·재배포 권한**을 Vinchin과 확인하시기 바랍니다. 각 페이지에는 원문 출처
링크와 "마이로켓 제공 한글 번역본" 표기를 넣어 출처를 명시했습니다. 상표·이미지의 권리는 Vinchin에 있습니다.
