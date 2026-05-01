import { remark } from "remark";
import gfm from "remark-gfm";
import html from "remark-html";

/**
 * Markdown → HTML 렌더러.
 * GFM 확장: 테이블, 체크리스트(- [ ]), 취소선, 자동링크, 각주.
 */
export async function renderMarkdown(md: string): Promise<string> {
  const result = await remark().use(gfm).use(html).process(md);
  return result.toString();
}
