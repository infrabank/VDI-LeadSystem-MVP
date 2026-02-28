// VDI Sales Assurance Program — Domain Types

export type OrgRole = "sales" | "reviewer" | "admin";

export type RequestStatus =
  | "submitted"
  | "triage"
  | "in_review"
  | "draft_ready"
  | "final_ready"
  | "delivered"
  | "closed";

export type RequestPriority = "low" | "normal" | "high" | "urgent";

export type VendorTrack =
  | "vmware"
  | "citrix"
  | "omnissa"
  | "microsoft"
  | "nutanix"
  | "other";

export type NetworkType =
  | "on_premise"
  | "hybrid"
  | "cloud"
  | "multi_cloud";

export type AttachmentKind =
  | "rfp"
  | "architecture"
  | "requirements"
  | "proposal"
  | "general";

export type AttachmentVisibility = "org" | "internal";

export type ScoreDomain =
  | "compute"
  | "storage"
  | "network"
  | "ha_dr"
  | "backup"
  | "license";

export type ReportState = "draft" | "final";

export type ComplianceLevel = "low" | "medium" | "high";

export type WinImpactGrade = "A" | "B" | "C" | "D";

export const STATUS_ORDER: RequestStatus[] = [
  "submitted",
  "triage",
  "in_review",
  "draft_ready",
  "final_ready",
  "delivered",
  "closed",
];

export const STATUS_LABELS: Record<RequestStatus, string> = {
  submitted: "제출됨",
  triage: "분류 중",
  in_review: "검토 중",
  draft_ready: "초안 완료",
  final_ready: "최종 완료",
  delivered: "전달됨",
  closed: "종료",
};

export const PRIORITY_LABELS: Record<RequestPriority, string> = {
  low: "낮음",
  normal: "보통",
  high: "높음",
  urgent: "긴급",
};

export const DOMAIN_LABELS: Record<ScoreDomain, string> = {
  compute: "컴퓨트",
  storage: "스토리지",
  network: "네트워크",
  ha_dr: "HA/DR",
  backup: "백업",
  license: "라이선스",
};

export const VENDOR_LABELS: Record<VendorTrack, string> = {
  vmware: "VMware",
  citrix: "Citrix",
  omnissa: "Omnissa (Horizon)",
  microsoft: "Microsoft (AVD/W365)",
  nutanix: "Nutanix",
  other: "기타",
};

export const NETWORK_LABELS: Record<NetworkType, string> = {
  on_premise: "온프레미스",
  hybrid: "하이브리드",
  cloud: "클라우드",
  multi_cloud: "멀티 클라우드",
};

// ---------- Row types ----------

export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrgMember {
  id: string;
  org_id: string;
  user_id: string;
  role: OrgRole;
  created_at: string;
}

export interface ReviewRequest {
  id: string;
  org_id: string;
  created_by: string;
  project_name: string;
  customer_name: string | null;
  vendor_track: VendorTrack;
  network_type: NetworkType;
  user_count: number;
  site_count: number;
  ha_required: boolean;
  dr_required: boolean;
  backup_required: boolean;
  backup_retention_months: number | null;
  eval_weight_tech: number;
  eval_weight_price: number;
  compliance_level: ComplianceLevel;
  security_flags: Record<string, boolean>;
  existing_infra: string | null;
  requirements_summary: string | null;
  budget_range: string | null;
  timeline: string | null;
  status: RequestStatus;
  priority: RequestPriority;
  due_at: string;
  assigned_to: string | null;
  notes_external: string | null;
  notes_internal: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewAttachment {
  id: string;
  request_id: string;
  org_id: string;
  uploaded_by: string;
  kind: AttachmentKind;
  storage_key: string;
  file_name: string;
  file_size: number;
  content_type: string | null;
  visibility: AttachmentVisibility;
  created_at: string;
}

export interface ReviewScore {
  id: string;
  request_id: string;
  domain: ScoreDomain;
  score: number;
  rationale: string | null;
  risks: string[];
  recommendations: string[];
  scored_by: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewReport {
  id: string;
  request_id: string;
  version: number;
  state: ReportState;
  content_json: ReportContent;
  pdf_storage_key: string | null;
  docx_storage_key: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface WinImpact {
  score: number;
  grade: WinImpactGrade;
  drivers: string[];
  mitigation: string[];
  assumptions: string[];
  estimated_improvement?: number;
}

export interface ComparisonRow {
  aspect: string;
  citrix: string;
  omnissa: string;
  neutral_note: string;
}

export interface VendorDefenseBlocks {
  neutral: string[];
  citrix: string[];
  omnissa: string[];
  competition_attack_points: DefenseQAItem[];
  competition_defense_points: DefenseQAItem[];
  comparison_matrix: ComparisonRow[];
}

export interface DefenseQAItem {
  question: string;
  answer: string;
  evidence: string;
}

export interface ReportContent {
  executive_summary: string;
  risk_level: "low" | "medium" | "high" | "critical";
  top_issues: string[];
  top_recommendations: string[];
  sections: ReportSection[];
  qa_items: QAItem[];
  proposal_snippets?: string[];
  conclusion?: string;
  risk_flags?: string[];
  win_impact?: WinImpact;
  vendor_defense?: VendorDefenseBlocks;
}

export interface ReportSection {
  title: string;
  body: string;
}

export interface QAItem {
  category?: string;
  question: string;
  answer: string;
}

export interface AuditLog {
  id: string;
  org_id: string | null;
  request_id: string | null;
  actor_user_id: string;
  action: string;
  payload: Record<string, unknown>;
  created_at: string;
}

// ---------- Valid status transitions ----------

export const VALID_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  submitted: ["triage"],
  triage: ["in_review", "closed"],
  in_review: ["draft_ready", "triage"],
  draft_ready: ["final_ready", "in_review"],
  final_ready: ["delivered"],
  delivered: ["closed"],
  closed: [],
};
