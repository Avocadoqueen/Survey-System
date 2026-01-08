/**
 * Question Controller
 * Handles HTTP requests for survey question management
 */

import { Request, Response } from 'express';
import QuestionModel, { CreateQuestionDTO, UpdateQuestionDTO, QuestionType, ReorderQuestionDTO } from '../models/question.model';
import SurveyModel from '../models/survey.model';

// Extend Express Request to include user from auth middleware
interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        user_id: number;
        email: string;
    };
}

// Valid question types for validation
const VALID_QUESTION_TYPES: QuestionType[] = ['text', 'single_choice', 'multiple_choice', 'rating', 'boolean'];

class QuestionController {
    /**
     * Create a new question for a survey
     * POST /api/surveys/:surveyId/questions
     */
    async create(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const surveyId = parseInt(req.params.surveyId, 10);
            const userId = req.user?.userId;
            const { question_text, question_type, options, is_required, order_index } = req.body;

            // Validate survey ID
            if (isNaN(surveyId)) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Invalid survey ID' 
                });
                return;
            }

            // Check authentication
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
                    message: 'You do not have permission to add questions to this survey' 
                });
                return;
            }

            // Validate question text
            if (!question_text || typeof question_text !== 'string' || question_text.trim().length === 0) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Question text is required' 
                });
                return;
            }

            // Validate question type if provided
            if (question_type && !VALID_QUESTION_TYPES.includes(question_type)) {
                res.status(400).json({ 
                    success: false, 
                    message: `Invalid question type. Must be one of: ${VALID_QUESTION_TYPES.join(', ')}` 
                });
                return;
            }

            // Validate options for choice-based questions
            if ((question_type === 'single_choice' || question_type === 'multiple_choice')) {
                if (!options || !Array.isArray(options) || options.length < 2) {
                    res.status(400).json({ 
                        success: false, 
                        message: 'Choice questions require at least 2 options' 
                    });
                    return;
                }
            }

            const questionData: CreateQuestionDTO = {
                survey_id: surveyId,
                question_text: question_text.trim(),
                question_type: question_type || 'text',
                options: options || null,
                is_required: is_required !== undefined ? Boolean(is_required) : false,
                order_index: order_index !== undefined ? parseInt(order_index, 10) : undefined
            };

            const question = await QuestionModel.create(questionData);

            res.status(201).json({
                success: true,
                message: 'Question created successfully',
                data: question
            });
        } catch (error) {
            console.error('Error creating question:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to create question' 
            });
        }
    }

    /**
     * Get all questions for a survey
     * GET /api/surveys/:surveyId/questions
     */
    async getBySurvey(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const surveyId = parseInt(req.params.surveyId, 10);

            if (isNaN(surveyId)) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Invalid survey ID' 
                });
                return;
            }

            // Check if survey exists
            const survey = await SurveyModel.findById(surveyId);
            if (!survey) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Survey not found' 
                });
                return;
            }

            const questions = await QuestionModel.findBySurveyId(surveyId);

            res.status(200).json({
                success: true,
                data: questions,
                count: questions.length
            });
        } catch (error) {
            console.error('Error fetching questions:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to fetch questions' 
            });
        }
    }

    /**
     * Update a question
     * PUT /api/questions/:id
     */
    async update(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const questionId = parseInt(req.params.id, 10);
            const userId = req.user?.userId;
            const { question_text, question_type, options, is_required, order_index } = req.body;

            if (isNaN(questionId)) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Invalid question ID' 
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

            // Get the question to find its survey
            const question = await QuestionModel.findById(questionId);
            if (!question) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Question not found' 
                });
                return;
            }

            // Check survey ownership
            const isOwner = await SurveyModel.isOwner(question.survey_id, userId);
            if (!isOwner) {
                res.status(403).json({ 
                    success: false, 
                    message: 'You do not have permission to update this question' 
                });
                return;
            }

            // Build update data with validation
            const updateData: UpdateQuestionDTO = {};

            if (question_text !== undefined) {
                if (typeof question_text !== 'string' || question_text.trim().length === 0) {
                    res.status(400).json({ 
                        success: false, 
                        message: 'Question text must be a non-empty string' 
                    });
                    return;
                }
                updateData.question_text = question_text.trim();
            }

            if (question_type !== undefined) {
                if (!VALID_QUESTION_TYPES.includes(question_type)) {
                    res.status(400).json({ 
                        success: false, 
                        message: `Invalid question type. Must be one of: ${VALID_QUESTION_TYPES.join(', ')}` 
                    });
                    return;
                }
                updateData.question_type = question_type;
            }

            if (options !== undefined) {
                updateData.options = options;
            }

            if (is_required !== undefined) {
                updateData.is_required = Boolean(is_required);
            }

            if (order_index !== undefined) {
                updateData.order_index = parseInt(order_index, 10);
            }

            const updatedQuestion = await QuestionModel.update(questionId, updateData);

            res.status(200).json({
                success: true,
                message: 'Question updated successfully',
                data: updatedQuestion
            });
        } catch (error) {
            console.error('Error updating question:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to update question' 
            });
        }
    }

    /**
     * Delete a question
     * DELETE /api/questions/:id
     */
    async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const questionId = parseInt(req.params.id, 10);
            const userId = req.user?.userId;

            if (isNaN(questionId)) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Invalid question ID' 
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

            // Get the question to find its survey
            const surveyId = await QuestionModel.getSurveyId(questionId);
            if (!surveyId) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Question not found' 
                });
                return;
            }

            // Check survey ownership
            const isOwner = await SurveyModel.isOwner(surveyId, userId);
            if (!isOwner) {
                res.status(403).json({ 
                    success: false, 
                    message: 'You do not have permission to delete this question' 
                });
                return;
            }

            const deleted = await QuestionModel.delete(questionId);

            if (!deleted) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Question not found' 
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Question deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting question:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to delete question' 
            });
        }
    }

    /**
     * Reorder questions within a survey
     * PUT /api/surveys/:surveyId/questions/reorder
     * Body: { questions: [{ question_id: number, order_index: number }, ...] }
     */
    async reorder(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const surveyId = parseInt(req.params.surveyId, 10);
            const userId = req.user?.userId;
            const { questions } = req.body;

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
                    message: 'You do not have permission to reorder questions in this survey' 
                });
                return;
            }

            // Validate questions array
            if (!questions || !Array.isArray(questions) || questions.length === 0) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Questions array is required' 
                });
                return;
            }

            // Validate each item in the array
            const reorderData: ReorderQuestionDTO[] = [];
            for (const item of questions) {
                if (typeof item.question_id !== 'number' || typeof item.order_index !== 'number') {
                    res.status(400).json({ 
                        success: false, 
                        message: 'Each question must have question_id and order_index as numbers' 
                    });
                    return;
                }
                reorderData.push({
                    question_id: item.question_id,
                    order_index: item.order_index
                });
            }

            await QuestionModel.reorder(surveyId, reorderData);

            // Fetch updated questions
            const updatedQuestions = await QuestionModel.findBySurveyId(surveyId);

            res.status(200).json({
                success: true,
                message: 'Questions reordered successfully',
                data: updatedQuestions
            });
        } catch (error) {
            console.error('Error reordering questions:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to reorder questions' 
            });
        }
    }
}

export default new QuestionController();
