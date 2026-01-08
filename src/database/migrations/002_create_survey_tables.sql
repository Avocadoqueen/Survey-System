-- Survey Management System Database Schema
-- Migration: 002_create_survey_tables.sql
-- Description: Creates tables for surveys, questions, responses, and answers

-- ============================================
-- SURVEYS TABLE
-- Stores survey metadata and ownership
-- ============================================
CREATE TABLE IF NOT EXISTS surveys (
    survey_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                           -- Survey creator/owner
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,                 -- Whether survey accepts responses
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key to users table
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Indexes for common queries
    INDEX idx_surveys_user_id (user_id),
    INDEX idx_surveys_is_active (is_active),
    INDEX idx_surveys_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- QUESTIONS TABLE
-- Stores questions belonging to surveys
-- ============================================
CREATE TABLE IF NOT EXISTS questions (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    survey_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('text', 'single_choice', 'multiple_choice', 'rating', 'boolean') NOT NULL DEFAULT 'text',
    options JSON,                                   -- For choice-based questions: ["Option 1", "Option 2"]
    is_required BOOLEAN DEFAULT FALSE,
    order_index INT NOT NULL DEFAULT 0,             -- For ordering questions within a survey
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key to surveys table
    FOREIGN KEY (survey_id) REFERENCES surveys(survey_id) ON DELETE CASCADE,
    
    -- Indexes for common queries
    INDEX idx_questions_survey_id (survey_id),
    INDEX idx_questions_order (survey_id, order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- RESPONSES TABLE
-- Stores survey response submissions (one per user per survey attempt)
-- ============================================
CREATE TABLE IF NOT EXISTS responses (
    response_id INT PRIMARY KEY AUTO_INCREMENT,
    survey_id INT NOT NULL,
    user_id INT,                                    -- NULL for anonymous responses
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (survey_id) REFERENCES surveys(survey_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    
    -- Indexes for common queries
    INDEX idx_responses_survey_id (survey_id),
    INDEX idx_responses_user_id (user_id),
    INDEX idx_responses_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ANSWERS TABLE
-- Stores individual answers to questions within a response
-- ============================================
CREATE TABLE IF NOT EXISTS answers (
    answer_id INT PRIMARY KEY AUTO_INCREMENT,
    response_id INT NOT NULL,
    question_id INT NOT NULL,
    answer_text TEXT,                               -- Stores the actual answer (text, selected option, rating value, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (response_id) REFERENCES responses(response_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
    
    -- Ensure one answer per question per response
    UNIQUE KEY unique_response_question (response_id, question_id),
    
    -- Indexes for common queries
    INDEX idx_answers_response_id (response_id),
    INDEX idx_answers_question_id (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
