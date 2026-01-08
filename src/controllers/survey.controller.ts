/**
 * Survey Controller
 * Handles HTTP requests for survey management
 */

import { Request, Response } from 'express';
import SurveyModel, { CreateSurveyDTO, UpdateSurveyDTO } from '../models/survey.model';

// Extend Express Request to include user from auth middleware
interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        user_id: number;
        email: string;
    };
}

class SurveyController {
    /**
     * Create a new survey
     * POST /api/surveys
     */
    async create(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { title, description, is_active } = req.body;
            const userId = req.user?.userId;

            // Validate required fields
            if (!userId) {
                res.status(401).json({ 
                    success: false, 
                    message: 'Authentication required' 
                });
                return;
            }

            if (!title || typeof title !== 'string' || title.trim().length === 0) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Title is required and must be a non-empty string' 
                });
                return;
            }

            const surveyData: CreateSurveyDTO = {
                user_id: userId,
                title: title.trim(),
                description: description?.trim() || null,
                is_active: is_active !== undefined ? Boolean(is_active) : true
            };

            const survey = await SurveyModel.create(surveyData);

            res.status(201).json({
                success: true,
                message: 'Survey created successfully',
                data: survey
            });
        } catch (error) {
            console.error('Error creating survey:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to create survey' 
            });
        }
    }

    /**
     * Get all surveys (with optional filters)
     * GET /api/surveys
     * Query params: is_active, limit, offset, my_surveys (boolean)
     */
    async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { is_active, limit, offset, my_surveys } = req.query;
            const userId = req.user?.userId;

            const options: {
                userId?: number;
                isActive?: boolean;
                limit?: number;
                offset?: number;
            } = {};

            // Filter by current user's surveys if requested
            if (my_surveys === 'true' && userId) {
                options.userId = userId;
            }

            // Filter by active status
            if (is_active !== undefined) {
                options.isActive = is_active === 'true';
            }

            // Pagination
            if (limit) {
                options.limit = Math.min(parseInt(limit as string, 10) || 20, 100);
            }
            if (offset) {
                options.offset = parseInt(offset as string, 10) || 0;
            }

            const surveys = await SurveyModel.findAll(options);

            res.status(200).json({
                success: true,
                data: surveys,
                count: surveys.length
            });
        } catch (error) {
            console.error('Error fetching surveys:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to fetch surveys' 
            });
        }
    }

    /**
     * Get a survey by ID
     * GET /api/surveys/:id
     */
    async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const surveyId = parseInt(req.params.id, 10);

            if (isNaN(surveyId)) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Invalid survey ID' 
                });
                return;
            }

            const survey = await SurveyModel.findById(surveyId);

            if (!survey) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Survey not found' 
                });
                return;
            }

            // Get response count for additional info
            const responseCount = await SurveyModel.getResponseCount(surveyId);

            res.status(200).json({
                success: true,
                data: {
                    ...survey,
                    response_count: responseCount
                }
            });
        } catch (error) {
            console.error('Error fetching survey:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to fetch survey' 
            });
        }
    }

    /**
     * Get a survey with all its questions
     * GET /api/surveys/:id/full
     */
    async getWithQuestions(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const surveyId = parseInt(req.params.id, 10);

            if (isNaN(surveyId)) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Invalid survey ID' 
                });
                return;
            }

            const survey = await SurveyModel.findWithQuestions(surveyId);

            if (!survey) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Survey not found' 
                });
                return;
            }

            // Check if survey is active for non-owners
            const userId = req.user?.userId;
            const isOwner = userId ? await SurveyModel.isOwner(surveyId, userId) : false;

            if (!survey.is_active && !isOwner) {
                res.status(403).json({ 
                    success: false, 
                    message: 'This survey is not currently active' 
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: survey
            });
        } catch (error) {
            console.error('Error fetching survey with questions:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to fetch survey' 
            });
        }
    }

    /**
     * Update a survey
     * PUT /api/surveys/:id
     */
    async update(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const surveyId = parseInt(req.params.id, 10);
            const userId = req.user?.userId;
            const { title, description, is_active } = req.body;

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

            // Check ownership
            const isOwner = await SurveyModel.isOwner(surveyId, userId);
            if (!isOwner) {
                res.status(403).json({ 
                    success: false, 
                    message: 'You do not have permission to update this survey' 
                });
                return;
            }

            // Build update data
            const updateData: UpdateSurveyDTO = {};
            
            if (title !== undefined) {
                if (typeof title !== 'string' || title.trim().length === 0) {
                    res.status(400).json({ 
                        success: false, 
                        message: 'Title must be a non-empty string' 
                    });
                    return;
                }
                updateData.title = title.trim();
            }
            
            if (description !== undefined) {
                updateData.description = description?.trim() || null;
            }
            
            if (is_active !== undefined) {
                updateData.is_active = Boolean(is_active);
            }

            const updatedSurvey = await SurveyModel.update(surveyId, updateData);

            res.status(200).json({
                success: true,
                message: 'Survey updated successfully',
                data: updatedSurvey
            });
        } catch (error) {
            console.error('Error updating survey:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to update survey' 
            });
        }
    }

    /**
     * Delete a survey
     * DELETE /api/surveys/:id
     */
    async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const surveyId = parseInt(req.params.id, 10);
            const userId = req.user?.userId;

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

            // Check ownership
            const isOwner = await SurveyModel.isOwner(surveyId, userId);
            if (!isOwner) {
                res.status(403).json({ 
                    success: false, 
                    message: 'You do not have permission to delete this survey' 
                });
                return;
            }

            const deleted = await SurveyModel.delete(surveyId);

            if (!deleted) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Survey not found' 
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Survey deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting survey:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to delete survey' 
            });
        }
    }
}

export default new SurveyController();
