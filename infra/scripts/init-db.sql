-- Initial database setup
-- Flyway will handle schema migrations; this just creates additional DBs if needed

-- Analytics read schema (separate from transactional schema)
CREATE SCHEMA IF NOT EXISTS analytics;
-- Optimization schema
CREATE SCHEMA IF NOT EXISTS optimization;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Enable pg_trgm for text search on campaign names
CREATE EXTENSION IF NOT EXISTS pg_trgm;
