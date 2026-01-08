/**
 * Question Routes
 * Defines API endpoints for survey question management
 */

import { Router } from 'express';
import QuestionController from '../controllers/question.controller';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// ============================================
// QUESTION ROUTES (nested under surveys)
// These routes are mounted at /api/surveys/:surveyId/questions
// ============================================

/**
 * POST /api/surveys/:surveyId/questions
 * Create a new question for a survey
 * Requires authentication and survey ownership
 */
router.post('/:surveyId/questions', authenticateToken, QuestionController.create.bind(QuestionController));

/**
 * GET /api/surveys/:surveyId/questions
 * Get all questions for a survey
 * Public access
 */
router.get('/:surveyId/questions', optionalAuth, QuestionController.getBySurvey.bind(QuestionController));

/**
 * PUT /api/surveys/:surveyId/questions/reorder
 * Reorder questions within a survey
 * Requires authentication and survey ownership
 */
router.put('/:surveyId/questions/reorder', authenticateToken, QuestionController.reorder.bind(QuestionController));

// ============================================
// STANDALONE QUESTION ROUTES
// These routes are mounted at /api/questions
// ============================================

const standaloneRouter = Router();

/**
 * PUT /api/questions/:id
 * Update a question
 * Requires authentication and survey ownership
 */
standaloneRouter.put('/:id', authenticateToken, QuestionController.update.bind(QuestionController));

/**
 * DELETE /api/questions/:id
 * Delete a question
 * Requires authentication and survey ownership
 */
standaloneRouter.delete('/:id', authenticateToken, QuestionController.delete.bind(QuestionController));

export { router as surveyQuestionRoutes, standaloneRouter as questionRoutes };
