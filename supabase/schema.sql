-- Enable the pgvector extension to support vector data type
create extension if not exists vector;

-- Create the documents table for storing our vector embeddings
create table if not exists documents (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  metadata jsonb,
  embedding vector(384) -- Size matches Hugging Face's all-MiniLM-L6-v2 model (384 dimensions)
);

-- Create an index to speed up vector similarity searches (using Ivfflat or HNSW cosine similarity)
-- HNSW index provides fast, high-quality approximate nearest neighbor search
create index if not exists documents_embedding_hnsw_idx 
  on documents 
  using hnsw (embedding vector_cosine_ops);

-- Create a database function (RPC) to perform cosine similarity searches
create or replace function match_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
