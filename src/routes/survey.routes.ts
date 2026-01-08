/**
 * Survey Routes
 * Defines API endpoints for survey management
 */

import { Router } from 'express';
import SurveyController from '../controllers/survey.controller';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// ============================================
// SURVEY ROUTES
// ============================================

/**
 * POST /api/surveys
 * Create a new survey
 * Requires authentication
 */
router.post('/', authenticateToken, SurveyController.create.bind(SurveyController));

/**
 * GET /api/surveys
 * Get all surveys (with optional filters)
 * Query params: is_active, limit, offset, my_surveys
 * Optional authentication (needed for my_surveys filter)
 */
router.get('/', optionalAuth, SurveyController.getAll.bind(SurveyController));

/**
 * GET /api/surveys/:id
 * Get a specific survey by ID
 * Public access
 */
router.get('/:id', optionalAuth, SurveyController.getById.bind(SurveyController));

/**
 * GET /api/surveys/:id/full
 * Get a survey with all its questions
 * Optional authentication (owners can see inactive surveys)
 */
router.get('/:id/full', optionalAuth, SurveyController.getWithQuestions.bind(SurveyController));

/**
 * PUT /api/surveys/:id
 * Update a survey
 * Requires authentication and ownership
 */
router.put('/:id', authenticateToken, SurveyController.update.bind(SurveyController));

/**
 * DELETE /api/surveys/:id
 * Delete a survey
 * Requires authentication and ownership
 */
router.delete('/:id', authenticateToken, SurveyController.delete.bind(SurveyController));

export default router;
