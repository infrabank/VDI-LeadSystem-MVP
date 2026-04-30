export type Cso = "C" | "S" | "O";
export type N2sfDomain =
  | "LP" | "IV" | "IM" | "AC"
  | "MA" | "EI" | "DA" | "AU" | "AP" | "AM" | "LI"
  | "SG" | "IS"
  | "IF" | "EB" | "CD" | "RA" | "SN" | "WA" | "BC"
  | "EK" | "EA" | "DT" | "DU"
  | "MD" | "DV" | "IN";

export type N2sfControl = {
  id: string;
  domain: N2sfDomain;
  domain_kr: string;
  chapter: 1 | 2 | 3 | 4 | 5 | 6;
  chapter_kr: string;
  title: string;
  description: string;
  cso: { C: boolean; S: boolean; O: boolean };
  is_managerial: boolean;
};

export type N2sfServiceModel = {
  key: "model3_saas_collab" | "model8_doc_mgmt" | "model10_wireless";
  number: 3 | 8 | 10;
  name_kr: string;
  name_en: string;
  scenario_summary: string;
  applicable_grades: Cso[];
  primary_threats: string[];
  required_controls: string[];
  emphasis_controls: string[];
  vdi_signal: string;
};
