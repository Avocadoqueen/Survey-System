/**
 * Response Routes
 * Defines API endpoints for survey response submission and retrieval
 */

import { Router } from 'express';
import ResponseController from '../controllers/response.controller';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// ============================================
// RESPONSE ROUTES (nested under surveys)
// These routes are mounted at /api/surveys/:surveyId/responses
// ============================================

/**
 * POST /api/surveys/:surveyId/responses
 * Submit a response to a survey
 * Optional authentication (allows anonymous responses)
 */
router.post('/:surveyId/responses', optionalAuth, ResponseController.submit.bind(ResponseController));

/**
 * GET /api/surveys/:surveyId/responses
 * Get all responses for a survey
 * Requires authentication and survey ownership
 * Query params: limit, offset, include_answers
 */
router.get('/:surveyId/responses', authenticateToken, ResponseController.getResponsesBySurvey.bind(ResponseController));

// ============================================
// STANDALONE RESPONSE ROUTES
// These routes are mounted at /api/responses
// ============================================

const standaloneRouter = Router();

/**
 * GET /api/responses/my
 * Get all responses submitted by the current user
 * Requires authentication
 */
standaloneRouter.get('/my', authenticateToken, ResponseController.getMyResponses.bind(ResponseController));

/**
 * GET /api/responses/:id
 * Get a specific response by ID
 * Requires authentication (owner or respondent)
 */
standaloneRouter.get('/:id', authenticateToken, ResponseController.getResponseById.bind(ResponseController));

/**
 * DELETE /api/responses/:id
 * Delete a response
 * Requires authentication and survey ownership
 */
standaloneRouter.delete('/:id', authenticateToken, ResponseController.delete.bind(ResponseController));

export { router as surveyResponseRoutes, standaloneRouter as responseRoutes };
