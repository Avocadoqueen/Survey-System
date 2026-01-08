/**
 * Response Model
 * Handles database operations for survey responses and answers
 */

import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Response {
    response_id: number;
    survey_id: number;
    user_id: number | null;  // Null for anonymous responses
    submitted_at: Date;
}

export interface Answer {
    answer_id: number;
    response_id: number;
    question_id: number;
    answer_text: string | null;
    created_at: Date;
}

export interface AnswerInput {
    question_id: number;
    answer_text: string;
}

export interface SubmitResponseDTO {
    survey_id: number;
    user_id?: number | null;
    answers: AnswerInput[];
}

// Response with all its answers
export interface ResponseWithAnswers extends Response {
    answers: Answer[];
}

// Detailed response with question information
export interface DetailedAnswer extends Answer {
    question_text: string;
    question_type: string;
}

export interface DetailedResponse extends Response {
    answers: DetailedAnswer[];
    survey_title?: string;
}

// ============================================
// RESPONSE MODEL CLASS
// ============================================

class ResponseModel {
    /**
     * Submit a new survey response with answers
     * Creates response and all answers in a single transaction
     * @param responseData - Response submission data
     * @returns The created response with answers
     */
    async submit(responseData: SubmitResponseDTO): Promise<ResponseWithAnswers> {
        const { survey_id, user_id = null, answers } = responseData;
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Create the response record
            const [responseResult] = await connection.execute<ResultSetHeader>(
                'INSERT INTO responses (survey_id, user_id) VALUES (?, ?)',
                [survey_id, user_id]
            );
            
            const responseId = responseResult.insertId;
            
            // Insert all answers
            const createdAnswers: Answer[] = [];
            
            for (const answer of answers) {
                const [answerResult] = await connection.execute<ResultSetHeader>(
                    'INSERT INTO answers (response_id, question_id, answer_text) VALUES (?, ?, ?)',
                    [responseId, answer.question_id, answer.answer_text]
                );
                
                createdAnswers.push({
                    answer_id: answerResult.insertId,
                    response_id: responseId,
                    question_id: answer.question_id,
                    answer_text: answer.answer_text,
                    created_at: new Date()
                });
            }
            
            await connection.commit();
            
            // Fetch the complete response
            const response = await this.findById(responseId);
            if (!response) {
                throw new Error('Failed to create response');
            }
            
            return {
                ...response,
                answers: createdAnswers
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Find a response by ID
     * @param responseId - The response ID
     * @returns The response or null if not found
     */
    async findById(responseId: number): Promise<Response | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM responses WHERE response_id = ?',
            [responseId]
        );
        
        return rows.length > 0 ? (rows[0] as Response) : null;
    }

    /**
     * Find a response with all its answers
     * @param responseId - The response ID
     * @returns Response with answers or null if not found
     */
    async findWithAnswers(responseId: number): Promise<ResponseWithAnswers | null> {
        const response = await this.findById(responseId);
        if (!response) {
            return null;
        }
        
        const [answerRows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM answers WHERE response_id = ?',
            [responseId]
        );
        
        return {
            ...response,
            answers: answerRows as Answer[]
        };
    }

    /**
     * Find a response with detailed answer information (includes question text)
     * @param responseId - The response ID
     * @returns Detailed response or null if not found
     */
    async findDetailedById(responseId: number): Promise<DetailedResponse | null> {
        // Get response with survey title
        const [responseRows] = await pool.execute<RowDataPacket[]>(
            `SELECT r.*, s.title as survey_title 
             FROM responses r 
             JOIN surveys s ON r.survey_id = s.survey_id 
             WHERE r.response_id = ?`,
            [responseId]
        );
        
        if (responseRows.length === 0) {
            return null;
        }
        
        const response = responseRows[0];
        
        // Get answers with question information
        const [answerRows] = await pool.execute<RowDataPacket[]>(
            `SELECT a.*, q.question_text, q.question_type 
             FROM answers a 
             JOIN questions q ON a.question_id = q.question_id 
             WHERE a.response_id = ?
             ORDER BY q.order_index ASC`,
            [responseId]
        );
        
        return {
            response_id: response.response_id,
            survey_id: response.survey_id,
            user_id: response.user_id,
            submitted_at: response.submitted_at,
            survey_title: response.survey_title,
            answers: answerRows as DetailedAnswer[]
        };
    }

    /**
     * Find all responses for a survey
     * @param surveyId - The survey ID
     * @param options - Pagination options
     * @returns Array of responses
     */
    async findBySurveyId(surveyId: number, options?: {
        limit?: number;
        offset?: number;
    }): Promise<Response[]> {
        let query = 'SELECT * FROM responses WHERE survey_id = ? ORDER BY submitted_at DESC';
        const params: any[] = [surveyId];
        
        if (options?.limit !== undefined) {
            query += ' LIMIT ?';
            params.push(options.limit);
            
            if (options?.offset !== undefined) {
                query += ' OFFSET ?';
                params.push(options.offset);
            }
        }
        
        const [rows] = await pool.execute<RowDataPacket[]>(query, params);
        return rows as Response[];
    }

    /**
     * Find all responses for a survey with their answers
     * @param surveyId - The survey ID
     * @returns Array of responses with answers
     */
    async findBySurveyIdWithAnswers(surveyId: number): Promise<ResponseWithAnswers[]> {
        const responses = await this.findBySurveyId(surveyId);
        
        const responsesWithAnswers: ResponseWithAnswers[] = [];
        
        for (const response of responses) {
            const [answerRows] = await pool.execute<RowDataPacket[]>(
                'SELECT * FROM answers WHERE response_id = ?',
                [response.response_id]
            );
            
            responsesWithAnswers.push({
                ...response,
                answers: answerRows as Answer[]
            });
        }
        
        return responsesWithAnswers;
    }

    /**
     * Find responses by user ID
     * @param userId - The user ID
     * @returns Array of responses
     */
    async findByUserId(userId: number): Promise<Response[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM responses WHERE user_id = ? ORDER BY submitted_at DESC',
            [userId]
        );
        
        return rows as Response[];
    }

    /**
     * Delete a response (cascades to answers)
     * @param responseId - The response ID
     * @returns True if deleted, false if not found
     */
    async delete(responseId: number): Promise<boolean> {
        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM responses WHERE response_id = ?',
            [responseId]
        );
        
        return result.affectedRows > 0;
    }

    /**
     * Count responses for a survey
     * @param surveyId - The survey ID
     * @returns Number of responses
     */
    async countBySurveyId(surveyId: number): Promise<number> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM responses WHERE survey_id = ?',
            [surveyId]
        );
        
        return rows[0].count;
    }

    /**
     * Check if a user has already responded to a survey
     * @param surveyId - The survey ID
     * @param userId - The user ID
     * @returns True if user has responded
     */
    async hasUserResponded(surveyId: number, userId: number): Promise<boolean> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT response_id FROM responses WHERE survey_id = ? AND user_id = ?',
            [surveyId, userId]
        );
        
        return rows.length > 0;
    }

    /**
     * Get survey statistics
     * @param surveyId - The survey ID
     * @returns Statistics object
     */
    async getSurveyStats(surveyId: number): Promise<{
        totalResponses: number;
        uniqueRespondents: number;
        anonymousResponses: number;
    }> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT 
                COUNT(*) as total_responses,
                COUNT(DISTINCT user_id) as unique_respondents,
                SUM(CASE WHEN user_id IS NULL THEN 1 ELSE 0 END) as anonymous_responses
             FROM responses 
             WHERE survey_id = ?`,
            [surveyId]
        );
        
        return {
            totalResponses: rows[0].total_responses,
            uniqueRespondents: rows[0].unique_respondents,
            anonymousResponses: rows[0].anonymous_responses
        };
    }
}

export default new ResponseModel();
