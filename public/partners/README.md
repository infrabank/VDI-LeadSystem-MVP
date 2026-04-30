# Partner Logos

이 디렉터리에 파트너 로고 SVG를 업로드하세요. `src/lib/site-config.ts`의 `partnerships[].logoFile` 값과 파일명이 일치해야 자동 노출됩니다.

## 필요 파일

| 파일명 | 출처 | 비고 |
|---|---|---|
| `vmware.svg` | https://www.vmware.com/company/news/media-resources.html | "VMware" wordmark, 단색 권장 |
| `omnissa.svg` | https://www.omnissa.com/company/brand/ | 2024년 분사 후 신규 브랜드 |
| `citrix.svg` | https://www.citrix.com/about/legal/brand-guidelines.html | "Citrix" wordmark |
| `acronis.svg` | https://www.acronis.com/en-us/about/brand-guidelines/ | "Acronis" + Cyber Protect 마크 |

## 권장 사양

- **포맷**: SVG (벡터, 라이트/다크 모두 사용 가능한 단색 또는 brand color)
- **viewBox**: 전체 wordmark 기준, 여백 최소화
- **너비/높이**: 자동 스케일 — `w-auto h-6 sm:h-7` 적용 예정
- **컬러**: brand color 권장 (예: VMware `#607078`, Citrix `#452170`)

## 자산 미준비 시

`logoFile`을 `undefined`로 두면 텍스트 칩으로 자동 폴백됩니다 — `site-config.ts`에서 해당 항목의 `logoFile` 줄을 주석 처리하세요.

## 라이선스 주의

각 벤더의 brand guidelines 문서에서 파트너용 로고 사용 권한·표기 제약을 반드시 확인하세요. 일반적으로 "Authorized Partner"·"Solutions Partner" 등 정식 파트너십이 있을 때만 wordmark 사용이 허용됩니다.
