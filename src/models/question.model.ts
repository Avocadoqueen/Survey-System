/**
 * Question Model
 * Handles database operations for survey questions
 */

import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type QuestionType = 'text' | 'single_choice' | 'multiple_choice' | 'rating' | 'boolean';

export interface Question {
    question_id: number;
    survey_id: number;
    question_text: string;
    question_type: QuestionType;
    options: string[] | null;  // JSON array for choice-based questions
    is_required: boolean;
    order_index: number;
    created_at: Date;
    updated_at: Date;
}

export interface CreateQuestionDTO {
    survey_id: number;
    question_text: string;
    question_type?: QuestionType;
    options?: string[];
    is_required?: boolean;
    order_index?: number;
}

export interface UpdateQuestionDTO {
    question_text?: string;
    question_type?: QuestionType;
    options?: string[];
    is_required?: boolean;
    order_index?: number;
}

export interface ReorderQuestionDTO {
    question_id: number;
    order_index: number;
}

// ============================================
// QUESTION MODEL CLASS
// ============================================

class QuestionModel {
    /**
     * Create a new question
     * @param questionData - Question creation data
     * @returns The created question
     */
    async create(questionData: CreateQuestionDTO): Promise<Question> {
        const { 
            survey_id, 
            question_text, 
            question_type = 'text',
            options = null,
            is_required = false,
            order_index
        } = questionData;
        
        // If no order_index provided, get the next available index
        let finalOrderIndex = order_index;
        if (finalOrderIndex === undefined) {
            finalOrderIndex = await this.getNextOrderIndex(survey_id);
        }
        
        // Convert options array to JSON string for storage
        const optionsJson = options ? JSON.stringify(options) : null;
        
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO questions (survey_id, question_text, question_type, options, is_required, order_index) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [survey_id, question_text, question_type, optionsJson, is_required, finalOrderIndex]
        );
        
        const question = await this.findById(result.insertId);
        if (!question) {
            throw new Error('Failed to create question');
        }
        return question;
    }

    /**
     * Find a question by ID
     * @param questionId - The question ID to find
     * @returns The question or null if not found
     */
    async findById(questionId: number): Promise<Question | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM questions WHERE question_id = ?',
            [questionId]
        );
        
        if (rows.length === 0) {
            return null;
        }
        
        // Parse JSON options field
        const question = rows[0] as Question;
        if (typeof question.options === 'string') {
            question.options = JSON.parse(question.options);
        }
        
        return question;
    }

    /**
     * Find all questions for a survey
     * @param surveyId - The survey ID
     * @returns Array of questions ordered by order_index
     */
    async findBySurveyId(surveyId: number): Promise<Question[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM questions WHERE survey_id = ? ORDER BY order_index ASC',
            [surveyId]
        );
        
        // Parse JSON options for each question
        return (rows as Question[]).map(question => {
            if (typeof question.options === 'string') {
                question.options = JSON.parse(question.options);
            }
            return question;
        });
    }

    /**
     * Update a question
     * @param questionId - The question ID to update
     * @param updateData - Fields to update
     * @returns The updated question or null if not found
     */
    async update(questionId: number, updateData: UpdateQuestionDTO): Promise<Question | null> {
        const fields: string[] = [];
        const values: any[] = [];
        
        // Build dynamic update query
        if (updateData.question_text !== undefined) {
            fields.push('question_text = ?');
            values.push(updateData.question_text);
        }
        
        if (updateData.question_type !== undefined) {
            fields.push('question_type = ?');
            values.push(updateData.question_type);
        }
        
        if (updateData.options !== undefined) {
            fields.push('options = ?');
            values.push(JSON.stringify(updateData.options));
        }
        
        if (updateData.is_required !== undefined) {
            fields.push('is_required = ?');
            values.push(updateData.is_required);
        }
        
        if (updateData.order_index !== undefined) {
            fields.push('order_index = ?');
            values.push(updateData.order_index);
        }
        
        if (fields.length === 0) {
            return this.findById(questionId);
        }
        
        values.push(questionId);
        
        await pool.execute<ResultSetHeader>(
            `UPDATE questions SET ${fields.join(', ')} WHERE question_id = ?`,
            values
        );
        
        return this.findById(questionId);
    }

    /**
     * Delete a question
     * @param questionId - The question ID to delete
     * @returns True if deleted, false if not found
     */
    async delete(questionId: number): Promise<boolean> {
        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM questions WHERE question_id = ?',
            [questionId]
        );
        
        return result.affectedRows > 0;
    }

    /**
     * Reorder questions within a survey
     * Updates order_index for multiple questions in a single transaction
     * @param surveyId - The survey ID
     * @param reorderData - Array of question IDs with new order indices
     */
    async reorder(surveyId: number, reorderData: ReorderQuestionDTO[]): Promise<void> {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Update each question's order_index
            for (const item of reorderData) {
                await connection.execute(
                    'UPDATE questions SET order_index = ? WHERE question_id = ? AND survey_id = ?',
                    [item.order_index, item.question_id, surveyId]
                );
            }
            
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Get the next available order index for a survey
     * @param surveyId - The survey ID
     * @returns The next order index
     */
    async getNextOrderIndex(surveyId: number): Promise<number> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT MAX(order_index) as max_index FROM questions WHERE survey_id = ?',
            [surveyId]
        );
        
        const maxIndex = rows[0].max_index;
        return maxIndex !== null ? maxIndex + 1 : 0;
    }

    /**
     * Get the survey ID for a question
     * @param questionId - The question ID
     * @returns The survey ID or null if question not found
     */
    async getSurveyId(questionId: number): Promise<number | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT survey_id FROM questions WHERE question_id = ?',
            [questionId]
        );
        
        return rows.length > 0 ? rows[0].survey_id : null;
    }

    /**
     * Count questions in a survey
     * @param surveyId - The survey ID
     * @returns Number of questions
     */
    async countBySurveyId(surveyId: number): Promise<number> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM questions WHERE survey_id = ?',
            [surveyId]
        );
        
        return rows[0].count;
    }
}

export default new QuestionModel();
