import controlsData from "./controls.json";

export type N2sfControl = {
  id: string;
  domain: string;
  domain_kr: string;
  chapter: 1 | 2 | 3 | 4 | 5 | 6;
  chapter_kr: string;
  title: string;
  description: string;
  cso: { C: boolean; S: boolean; O: boolean };
  is_managerial: boolean;
};

export const N2SF_CONTROLS = controlsData as N2sfControl[];
export const byId = new Map(N2SF_CONTROLS.map((c) => [c.id, c]));
export function byDomain(d: string): N2sfControl[] {
  return N2SF_CONTROLS.filter((c) => c.domain === d);
}
export function byChapter(ch: number): N2sfControl[] {
  return N2SF_CONTROLS.filter((c) => c.chapter === ch);
}
