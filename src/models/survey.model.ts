/**
 * Survey Model
 * Handles database operations for surveys
 */

import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Survey {
    survey_id: number;
    user_id: number;
    title: string;
    description: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateSurveyDTO {
    user_id: number;
    title: string;
    description?: string;
    is_active?: boolean;
}

export interface UpdateSurveyDTO {
    title?: string;
    description?: string;
    is_active?: boolean;
}

// Extended survey with questions for detailed view
export interface SurveyWithQuestions extends Survey {
    questions: Question[];
}

// Import Question type for SurveyWithQuestions
import { Question } from './question.model';

// ============================================
// SURVEY MODEL CLASS
// ============================================

class SurveyModel {
    /**
     * Create a new survey
     * @param surveyData - Survey creation data
     * @returns The created survey
     */
    async create(surveyData: CreateSurveyDTO): Promise<Survey> {
        const { user_id, title, description = null, is_active = true } = surveyData;
        
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO surveys (user_id, title, description, is_active) 
             VALUES (?, ?, ?, ?)`,
            [user_id, title, description, is_active]
        );
        
        // Fetch and return the created survey
        const survey = await this.findById(result.insertId);
        if (!survey) {
            throw new Error('Failed to create survey');
        }
        return survey;
    }

    /**
     * Find a survey by ID
     * @param surveyId - The survey ID to find
     * @returns The survey or null if not found
     */
    async findById(surveyId: number): Promise<Survey | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM surveys WHERE survey_id = ?',
            [surveyId]
        );
        
        return rows.length > 0 ? (rows[0] as Survey) : null;
    }

    /**
     * Find all surveys with optional filtering
     * @param options - Filter options
     * @returns Array of surveys
     */
    async findAll(options?: { 
        userId?: number; 
        isActive?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<Survey[]> {
        let query = 'SELECT * FROM surveys WHERE 1=1';
        const params: any[] = [];
        
        // Apply filters
        if (options?.userId !== undefined) {
            query += ' AND user_id = ?';
            params.push(options.userId);
        }
        
        if (options?.isActive !== undefined) {
            query += ' AND is_active = ?';
            params.push(options.isActive);
        }
        
        // Order by most recent first
        query += ' ORDER BY created_at DESC';
        
        // Apply pagination
        if (options?.limit !== undefined) {
            query += ' LIMIT ?';
            params.push(options.limit);
            
            if (options?.offset !== undefined) {
                query += ' OFFSET ?';
                params.push(options.offset);
            }
        }
        
        const [rows] = await pool.execute<RowDataPacket[]>(query, params);
        return rows as Survey[];
    }

    /**
     * Find surveys created by a specific user
     * @param userId - The user ID
     * @returns Array of surveys
     */
    async findByUserId(userId: number): Promise<Survey[]> {
        return this.findAll({ userId });
    }

    /**
     * Update a survey
     * @param surveyId - The survey ID to update
     * @param updateData - Fields to update
     * @returns The updated survey or null if not found
     */
    async update(surveyId: number, updateData: UpdateSurveyDTO): Promise<Survey | null> {
        const fields: string[] = [];
        const values: any[] = [];
        
        // Build dynamic update query based on provided fields
        if (updateData.title !== undefined) {
            fields.push('title = ?');
            values.push(updateData.title);
        }
        
        if (updateData.description !== undefined) {
            fields.push('description = ?');
            values.push(updateData.description);
        }
        
        if (updateData.is_active !== undefined) {
            fields.push('is_active = ?');
            values.push(updateData.is_active);
        }
        
        // If no fields to update, return current survey
        if (fields.length === 0) {
            return this.findById(surveyId);
        }
        
        values.push(surveyId);
        
        await pool.execute<ResultSetHeader>(
            `UPDATE surveys SET ${fields.join(', ')} WHERE survey_id = ?`,
            values
        );
        
        return this.findById(surveyId);
    }

    /**
     * Delete a survey (cascades to questions, responses, and answers)
     * @param surveyId - The survey ID to delete
     * @returns True if deleted, false if not found
     */
    async delete(surveyId: number): Promise<boolean> {
        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM surveys WHERE survey_id = ?',
            [surveyId]
        );
        
        return result.affectedRows > 0;
    }

    /**
     * Get a survey with all its questions
     * @param surveyId - The survey ID
     * @returns Survey with questions or null if not found
     */
    async findWithQuestions(surveyId: number): Promise<SurveyWithQuestions | null> {
        const survey = await this.findById(surveyId);
        if (!survey) {
            return null;
        }
        
        // Fetch questions for this survey
        const [questionRows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM questions WHERE survey_id = ? ORDER BY order_index ASC',
            [surveyId]
        );
        
        return {
            ...survey,
            questions: questionRows as Question[]
        };
    }

    /**
     * Check if a user owns a survey
     * @param surveyId - The survey ID
     * @param userId - The user ID
     * @returns True if user owns the survey
     */
    async isOwner(surveyId: number, userId: number): Promise<boolean> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT survey_id FROM surveys WHERE survey_id = ? AND user_id = ?',
            [surveyId, userId]
        );
        
        return rows.length > 0;
    }

    /**
     * Get response count for a survey
     * @param surveyId - The survey ID
     * @returns Number of responses
     */
    async getResponseCount(surveyId: number): Promise<number> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM responses WHERE survey_id = ?',
            [surveyId]
        );
        
        return rows[0].count;
    }
}

export default new SurveyModel();
