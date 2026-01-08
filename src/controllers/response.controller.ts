/**
 * Response Controller
 * Handles HTTP requests for survey response submission and retrieval
 */

import { Request, Response } from 'express';
import ResponseModel, { SubmitResponseDTO, AnswerInput } from '../models/response.model';
import SurveyModel from '../models/survey.model';
import QuestionModel from '../models/question.model';

// Extend Express Request to include user from auth middleware
interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        user_id: number;
        email: string;
    };
}

class ResponseController {
    /**
     * Submit a response to a survey
     * POST /api/surveys/:surveyId/responses
     * Body: { answers: [{ question_id: number, answer_text: string }, ...] }
     */
    async submit(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const surveyId = parseInt(req.params.surveyId, 10);
            const userId = req.user?.userId || null;  // Can be null for anonymous responses
            const { answers } = req.body;

            // Validate survey ID
            if (isNaN(surveyId)) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Invalid survey ID' 
                });
                return;
            }

            // Check if survey exists and is active
            const survey = await SurveyModel.findById(surveyId);
            if (!survey) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Survey not found' 
                });
                return;
            }

            if (!survey.is_active) {
                res.status(403).json({ 
                    success: false, 
                    message: 'This survey is not currently accepting responses' 
                });
                return;
            }

            // Check if user has already responded (if authenticated)
            if (userId) {
                const hasResponded = await ResponseModel.hasUserResponded(surveyId, userId);
                if (hasResponded) {
                    res.status(409).json({ 
                        success: false, 
                        message: 'You have already submitted a response to this survey' 
                    });
                    return;
                }
            }

            // Validate answers array
            if (!answers || !Array.isArray(answers)) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Answers array is required' 
                });
                return;
            }

            // Get survey questions for validation
            const questions = await QuestionModel.findBySurveyId(surveyId);
            const questionMap = new Map(questions.map(q => [q.question_id, q]));

            // Validate each answer
            const validatedAnswers: AnswerInput[] = [];
            const answeredQuestionIds = new Set<number>();

            for (const answer of answers) {
                // Validate answer structure
                if (typeof answer.question_id !== 'number') {
                    res.status(400).json({ 
                        success: false, 
                        message: 'Each answer must have a valid question_id' 
                    });
                    return;
                }

                // Check if question belongs to this survey
                const question = questionMap.get(answer.question_id);
                if (!question) {
                    res.status(400).json({ 
                        success: false, 
                        message: `Question ${answer.question_id} does not belong to this survey` 
                    });
                    return;
                }

                // Check for duplicate answers
                if (answeredQuestionIds.has(answer.question_id)) {
                    res.status(400).json({ 
                        success: false, 
                        message: `Duplicate answer for question ${answer.question_id}` 
                    });
                    return;
                }

                answeredQuestionIds.add(answer.question_id);

                // Validate answer based on question type
                const answerText = answer.answer_text?.toString() || '';
                
                // Check required questions
                if (question.is_required && !answerText.trim()) {
                    res.status(400).json({ 
                        success: false, 
                        message: `Question "${question.question_text}" is required` 
                    });
                    return;
                }

                // Validate choice-based answers
                if (answerText && (question.question_type === 'single_choice' || question.question_type === 'multiple_choice')) {
                    const validOptions = question.options || [];
                    
                    if (question.question_type === 'single_choice') {
                        if (!validOptions.includes(answerText)) {
                            res.status(400).json({ 
                                success: false, 
                                message: `Invalid option for question "${question.question_text}"` 
                            });
                            return;
                        }
                    } else {
                        // Multiple choice - answer_text contains comma-separated values
                        const selectedOptions = answerText.split(',').map(o => o.trim());
                        for (const option of selectedOptions) {
                            if (!validOptions.includes(option)) {
                                res.status(400).json({ 
                                    success: false, 
                                    message: `Invalid option "${option}" for question "${question.question_text}"` 
                                });
                                return;
                            }
                        }
                    }
                }

                // Validate rating answers (typically 1-5 or 1-10)
                if (answerText && question.question_type === 'rating') {
                    const rating = parseInt(answerText, 10);
                    if (isNaN(rating) || rating < 1 || rating > 10) {
                        res.status(400).json({ 
                            success: false, 
                            message: `Rating must be a number between 1 and 10 for question "${question.question_text}"` 
                        });
                        return;
                    }
                }

                // Validate boolean answers
                if (answerText && question.question_type === 'boolean') {
                    const lowerAnswer = answerText.toLowerCase();
                    if (!['true', 'false', 'yes', 'no', '1', '0'].includes(lowerAnswer)) {
                        res.status(400).json({ 
                            success: false, 
                            message: `Boolean answer required for question "${question.question_text}"` 
                        });
                        return;
                    }
                }

                validatedAnswers.push({
                    question_id: answer.question_id,
                    answer_text: answerText
                });
            }

            // Check all required questions are answered
            for (const question of questions) {
                if (question.is_required && !answeredQuestionIds.has(question.question_id)) {
                    res.status(400).json({ 
                        success: false, 
                        message: `Required question "${question.question_text}" was not answered` 
                    });
                    return;
                }
            }

            // Submit the response
            const responseData: SubmitResponseDTO = {
                survey_id: surveyId,
                user_id: userId,
                answers: validatedAnswers
            };

            const submittedResponse = await ResponseModel.submit(responseData);

            res.status(201).json({
                success: true,
                message: 'Response submitted successfully',
                data: submittedResponse
            });
        } catch (error) {
            console.error('Error submitting response:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to submit response' 
            });
        }
    }

    /**
     * Get all responses for a survey (survey owner only)
     * GET /api/surveys/:surveyId/responses
     */
    async getResponsesBySurvey(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const surveyId = parseInt(req.params.surveyId, 10);
            const userId = req.user?.userId;
            const { limit, offset, include_answers } = req.query;

            if (isNaN(surveyId)) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Invalid survey ID' 
                });
                return;
            }

            if (!userId) {
                res.status(401).json({ 
                    success: false, 
                    message: 'Authentication required' 
                });
                return;
            }

            // Check survey ownership
            const isOwner = await SurveyModel.isOwner(surveyId, userId);
            if (!isOwner) {
                res.status(403).json({ 
                    success: false, 
                    message: 'You do not have permission to view responses for this survey' 
                });
                return;
            }

            // Get responses with or without answers
            let responses;
            if (include_answers === 'true') {
                responses = await ResponseModel.findBySurveyIdWithAnswers(surveyId);
            } else {
                const options: { limit?: number; offset?: number } = {};
                if (limit) options.limit = parseInt(limit as string, 10);
                if (offset) options.offset = parseInt(offset as string, 10);
                responses = await ResponseModel.findBySurveyId(surveyId, options);
            }

            // Get statistics
            const stats = await ResponseModel.getSurveyStats(surveyId);

            res.status(200).json({
                success: true,
                data: responses,
                count: responses.length,
                stats
            });
        } catch (error) {
            console.error('Error fetching responses:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to fetch responses' 
            });
        }
    }

    /**
     * Get a specific response by ID
     * GET /api/responses/:id
     */
    async getResponseById(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const responseId = parseInt(req.params.id, 10);
            const userId = req.user?.userId;

            if (isNaN(responseId)) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Invalid response ID' 
                });
                return;
            }

            if (!userId) {
                res.status(401).json({ 
                    success: false, 
                    message: 'Authentication required' 
                });
                return;
            }

            // Get the detailed response
            const response = await ResponseModel.findDetailedById(responseId);

            if (!response) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Response not found' 
                });
                return;
            }

            // Check if user is the survey owner or the respondent
            const isOwner = await SurveyModel.isOwner(response.survey_id, userId);
            const isRespondent = response.user_id === userId;

            if (!isOwner && !isRespondent) {
                res.status(403).json({ 
                    success: false, 
                    message: 'You do not have permission to view this response' 
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: response
            });
        } catch (error) {
            console.error('Error fetching response:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to fetch response' 
            });
        }
    }

    /**
     * Get responses submitted by the current user
     * GET /api/responses/my
     */
    async getMyResponses(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ 
                    success: false, 
                    message: 'Authentication required' 
                });
                return;
            }

            const responses = await ResponseModel.findByUserId(userId);

            res.status(200).json({
                success: true,
                data: responses,
                count: responses.length
            });
        } catch (error) {
            console.error('Error fetching user responses:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to fetch responses' 
            });
        }
    }

    /**
     * Delete a response (survey owner only)
     * DELETE /api/responses/:id
     */
    async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const responseId = parseInt(req.params.id, 10);
            const userId = req.user?.userId;

            if (isNaN(responseId)) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Invalid response ID' 
                });
                return;
            }

            if (!userId) {
                res.status(401).json({ 
                    success: false, 
                    message: 'Authentication required' 
                });
                return;
            }

            // Get the response to check ownership
            const response = await ResponseModel.findById(responseId);
            if (!response) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Response not found' 
                });
                return;
            }

            // Only survey owner can delete responses
            const isOwner = await SurveyModel.isOwner(response.survey_id, userId);
            if (!isOwner) {
                res.status(403).json({ 
                    success: false, 
                    message: 'You do not have permission to delete this response' 
                });
                return;
            }

            await ResponseModel.delete(responseId);

            res.status(200).json({
                success: true,
                message: 'Response deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting response:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to delete response' 
            });
        }
    }
}

export default new ResponseController();
