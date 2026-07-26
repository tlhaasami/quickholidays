/**
 * RAG configuration settings.
 * Adjust threshold, model names, and counts here to tune performance.
 */
export const RAG_CONFIG = {
  // Database configuration overrides
  DB_DEFAULT_USER: "postgres.ehlqrvjorayhofbttnfw",
  DB_DEFAULT_HOST: "aws-0-ap-southeast-1.pooler.supabase.com",
  DB_DEFAULT_NAME: "postgres",
  DB_DEFAULT_PORT: 6543,

  // Vector DB query parameters
  MATCH_THRESHOLD: 0.3,
  MATCH_COUNT: 4,

  // Model references
  EMBEDDING_MODEL: "embed-english-light-v3.0",
  CHAT_MODEL: "llama-3.3-70b-versatile",

  // API endpoints
  COHERE_EMBED_URL: "https://api.cohere.com/v1/embed",
  GROQ_CHAT_URL: "https://api.groq.com/openai/v1/chat/completions"
};
