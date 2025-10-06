-- Function to match embeddings using cosine similarity
-- This function is used by the RAG system for semantic search

CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  filter_course_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  course_id uuid,
  chapter_id uuid,
  content_type text,
  content_text text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.course_id,
    e.chapter_id,
    e.content_type,
    e.content_text,
    e.metadata,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM embeddings e
  WHERE 
    (filter_course_id IS NULL OR e.course_id = filter_course_id)
    AND 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION match_embeddings TO authenticated;
GRANT EXECUTE ON FUNCTION match_embeddings TO service_role;

