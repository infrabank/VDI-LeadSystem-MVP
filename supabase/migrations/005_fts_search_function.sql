-- FTS search function for content
CREATE OR REPLACE FUNCTION search_contents(
  search_query text,
  filter_type text DEFAULT NULL,
  filter_tag text DEFAULT NULL,
  page_num integer DEFAULT 1,
  page_size integer DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  type text,
  title text,
  slug text,
  excerpt text,
  cover_image_url text,
  tags text[],
  category text,
  published_at timestamptz,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ci.id,
    ci.type,
    ci.title,
    ci.slug,
    ci.excerpt,
    ci.cover_image_url,
    ci.tags,
    ci.category,
    ci.published_at,
    ts_rank(ci.fts, plainto_tsquery('simple', search_query)) AS rank
  FROM content_items ci
  WHERE ci.status = 'published'
    AND (search_query = '' OR ci.fts @@ plainto_tsquery('simple', search_query))
    AND (filter_type IS NULL OR ci.type = filter_type)
    AND (filter_tag IS NULL OR filter_tag = ANY(ci.tags))
  ORDER BY
    CASE WHEN search_query = '' THEN 0 ELSE ts_rank(ci.fts, plainto_tsquery('simple', search_query)) END DESC,
    ci.published_at DESC
  LIMIT page_size
  OFFSET (page_num - 1) * page_size;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
