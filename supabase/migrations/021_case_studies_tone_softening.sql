-- 021_case_studies_tone_softening.sql
-- Case Studies 성과 표현을 검증 가능한 운영 개선 중심으로 완화.
--
-- 변경 대상:
-- 1) case-public-vdi-stabilization
--    - title: 프로파일 안정화 → 사용자 환경 운영 표준화
--    - excerpt: 외부접속 장애 빈도/프로파일 손실 → 운영 안정화/환경 운영 표준화
--    - body_md: "중단 사례 0건" → "사전 알림 절차로 관리"
--                "프로파일 손실 사례 감소" → "운영 리스크를 모니터링·정리 절차로 관리"
--    - seo_description: 동일한 톤 다운 적용
-- 2) case-network-isolation-pre-diagnosis
--    - body_md: "위원회 통과 가능성 낮음/향상" → "보안성 검토 대응 자료 보강/내부 설명자료 완성도 향상"
--
-- 멱등: REPLACE 기반 + 동일 문자열 입력 시 noop. 안전하게 반복 실행 가능.

UPDATE content_items
SET
  title = '공공기관 VDI 운영 안정화 — 외부접속·인증서·사용자 환경 운영 표준화',
  excerpt = '중앙행정 데이터 기관의 Omnissa Horizon·UAG·인증서 운영을 정기 점검·갱신 체계로 정비. 통계 데이터 분석 사용자 ~수백명 환경에서 외부접속 운영 안정화와 사용자 환경 운영 표준화를 정비했다.',
  body_md = REPLACE(
    REPLACE(
      body_md,
      '- 외부접속 인증서 만료로 인한 중단 사례 0건 (12개월 누적)',
      '- 외부접속 인증서 만료 리스크를 90일 사전 알림 절차로 관리'
    ),
    '- 프로파일 손실 사례 감소 (모니터링 + 정기 정리 도입 후)',
    '- 프로파일 운영 리스크를 모니터링·정기 정리 절차로 관리'
  ),
  seo_description = '중앙행정 데이터 기관의 Horizon·UAG·인증서 운영을 정기 점검·갱신 체계로 정비. 인증서 만료·프로파일 운영 리스크를 사전 알림과 모니터링 절차로 관리.',
  updated_at = now()
WHERE slug = 'case-public-vdi-stabilization';

UPDATE content_items
SET
  body_md = REPLACE(
    REPLACE(
      body_md,
      '- 사용자군별 접근 정책이 분리 운영되지 않음 → 보안성 검토 위원회 통과 가능성 낮음',
      '- 사용자군별 접근 정책이 분리 운영되지 않음 → 보안성 검토 대응 자료 보강 필요'
    ),
    '- Quick Win 5건은 발주 전 자체 정비 → 위원회 통과 가능성 향상',
    '- Quick Win 5건은 발주 전 자체 정비 → 보안성 검토 전 내부 설명자료 완성도 향상'
  ),
  updated_at = now()
WHERE slug = 'case-network-isolation-pre-diagnosis';

-- 검증 쿼리
-- SELECT slug, title FROM content_items WHERE slug IN ('case-public-vdi-stabilization', 'case-network-isolation-pre-diagnosis');
-- SELECT slug FROM content_items WHERE body_md ILIKE '%중단 사례 0건%' OR body_md ILIKE '%위원회 통과 가능성%';
