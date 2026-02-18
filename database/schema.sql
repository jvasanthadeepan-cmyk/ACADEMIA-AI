-- ACADEMIA AI Database Schema
-- Optimized for PostgreSQL on Render

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    college_name TEXT,
    course TEXT,
    year_of_study TEXT CHECK (year_of_study IN ('year1', 'year2', 'year3', 'year4')),
    target_career TEXT,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Study Tasks Table
CREATE TABLE IF NOT EXISTS study_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'inProgress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Focus Sessions Table
CREATE TABLE IF NOT EXISTS focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat History Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Career Roadmaps Table
CREATE TABLE IF NOT EXISTS career_roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    degree TEXT,
    target_job TEXT,
    timeline TEXT,
    skill_roadmap JSONB,
    recommended_tools JSONB,
    project_suggestions JSONB,
    internship_path JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habits Table
CREATE TABLE IF NOT EXISTS habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    completed_days JSONB DEFAULT '[]', -- Array of date strings like ["2026-02-18"]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON study_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
