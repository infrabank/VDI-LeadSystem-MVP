# Leadership Photos

이 디렉터리에 리더십 사진(square JPG/PNG)을 업로드하세요. 파일명은 `src/lib/site-config.ts`의 `leadership[].photoFile` 값과 일치해야 합니다.

## 권장 사양

- **포맷**: JPG (또는 PNG, 투명 배경 불필요)
- **크기**: 400×400 이상 정사각형
- **파일명**: 슬롯 ID 기반 (예: `ceo.jpg`, `secure-workspace-lead.jpg`)
- **용량**: ≤ 200KB (JPG 80% 품질 정도)

## 사진 미준비 시

`photoFile` 필드를 `undefined`로 두면 자동으로 이니셜(이름 첫 글자) 또는 슬롯 첫 글자로 폴백 렌더됩니다.

## 정보 업데이트

`src/lib/site-config.ts`의 `leadership` 배열에서 각 슬롯의 `name`·`bio`·`expertise`·`linkedinUrl`·`email`을 채우면 자동 노출됩니다. 코드 추가 변경 없음.
