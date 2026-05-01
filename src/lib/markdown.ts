import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

/**
 * Markdown → HTML 렌더러.
 *
 * Pipeline: parse → gfm → mdast→hast → sanitize(default schema) → stringify
 *
 * 보안:
 * - rehype-sanitize default schema 사용 → <script>, on*= 핸들러, javascript: URL 차단
 * - admin이 작성하는 콘텐츠라도 안전 (admin 계정 탈취·복붙 실수 대응)
 *
 * 확장:
 * - GFM: 표·체크리스트·취소선·자동링크
 * - 표 클래스 보존을 위해 schema 일부 확장
 */
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), "className"],
    span: [...(defaultSchema.attributes?.span || []), "className"],
  },
};

export async function renderMarkdown(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .process(md);
  return String(file);
}
