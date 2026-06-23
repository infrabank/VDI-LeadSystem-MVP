# Vinchin 매뉴얼 한글화 — 번역 규칙 & 용어집

대상: helpcenter.vinchin.com (Vinchin Backup & Recovery 사용자 매뉴얼)의 한국어판.
독자: 한국 기업의 전산 담당자·엔지니어. 정중한 설명체("~합니다 / ~하세요").

## 절대 규칙 (반드시 지킬 것)

1. **HTML 태그를 그대로 보존.** 입력에 `<strong>`, `<a href=...>`, `<em>`, `<span>` 등이 있으면
   같은 태그를 같은 순서·같은 개수로 유지한다. 태그의 속성(href, class 등)은 절대 바꾸지 않는다.
   태그 사이의 사람이 읽는 텍스트만 번역한다.
   - 예) `When done, click <strong>Next</strong>.` → `완료되면 <strong>Next</strong>를 클릭합니다.`
2. **영문으로 남길 것 (번역 금지):**
   - 제품/기능 고유명: Vinchin, VMware, vSphere, ESXi, Hyper-V, Proxmox, Citrix, XenServer, XCP-ng,
     oVirt, RHV, OLVM, ZStack, OpenStack, Sangfor, Huawei FusionCompute, H3C, Kubernetes, AWS, EC2,
     Oracle, MySQL, PostgreSQL, MariaDB, SQL Server, Microsoft 365, Exchange, NAS, SAN, DAS, CDP 등.
   - **UI 컨트롤 라벨**(화면의 버튼·탭·메뉴·필드 이름) — 특히 `<strong>`로 감싼 라벨과 메뉴 경로:
     `Next`, `OK`, `Backup`, `Restore`, `General Strategy`, `Backup > Kubernetes`, `New Backup Job` 등은
     **영문 그대로 둔다.** (스크린샷이 영문이므로 화면과 일치시키기 위함)
   - 코드/명령어/경로/파일명/IP/포트/버전 숫자/CLI: 그대로 둔다.
3. **메뉴 경로**는 영문 라벨 유지하되 조사만 한글: `In the <strong>Backup</strong> page` →
   `<strong>Backup</strong> 페이지에서`.
4. 의미를 바꾸지 말 것. 의역보다 정확한 기술 번역. 문장을 빠뜨리지 말 것.
5. 출력은 입력 문자열 1:1 매핑. 빈 문자열·기호만 있는 항목은 그대로 반환.

## 핵심 용어집 (prose 안에서 일관 사용)

| English | 한국어 |
|---|---|
| backup | 백업 |
| restore / recovery | 복원 |
| Full Restore | 전체 복원 |
| Granular Restore | 세분화 복원 |
| Instant Restore | 즉시 복원 |
| backup job | 백업 작업 |
| restore job | 복원 작업 |
| schedule | 일정 |
| strategy | 전략 |
| retention policy | 보존 정책 |
| throttling policy | 스로틀링 정책 |
| storage / repository | 스토리지 / 저장소 |
| backup node | 백업 노드 |
| backup plugin | 백업 플러그인 |
| agent / agentless | 에이전트 / 에이전트리스 |
| host | 호스트 |
| virtual machine (VM) | 가상 머신(VM) |
| virtualization | 가상화 |
| snapshot | 스냅샷 |
| incremental / full backup | 증분 / 전체 백업 |
| deduplication | 중복 제거 |
| compression | 압축 |
| encryption | 암호화 |
| verification | 검증 |
| wizard | 마법사 |
| dashboard | 대시보드 |
| namespace | 네임스페이스 |
| cluster | 클러스터 |
| node | 노드 |
| select | 선택 |
| enable / disable | 활성화 / 비활성화 |
| click | 클릭 |
| Please complete the wizard | 마법사를 완료하세요 |
| Continuous Data Protection | 연속 데이터 보호(CDP) |
| disaster recovery | 재해 복구 |
| RTO / RPO | RTO / RPO (그대로) |

## 톤
- 단계 설명: "~합니다 / ~하세요 / ~할 수 있습니다."
- "you can" → "~할 수 있습니다", "please" → 생략하거나 "~하세요".
