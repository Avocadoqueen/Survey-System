/**
 * Survey System Backend - Main Entry Point
 * Express server configuration and route registration
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes';
import surveyRoutes from './routes/survey.routes';
import { surveyQuestionRoutes, questionRoutes } from './routes/question.routes';
import { surveyResponseRoutes, responseRoutes } from './routes/response.routes';

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// Enable CORS for all origins (configure for production)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API version info
app.get('/api', (req: Request, res: Response) => {
    res.status(200).json({
        name: 'Survey System API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            surveys: '/api/surveys',
            questions: '/api/questions',
            responses: '/api/responses'
        }
    });
});

// Authentication routes (register, login)
app.use('/api/auth', authRoutes);

// Survey routes (CRUD operations)
app.use('/api/surveys', surveyRoutes);

// Question routes nested under surveys
// POST /api/surveys/:surveyId/questions
// GET /api/surveys/:surveyId/questions
// PUT /api/surveys/:surveyId/questions/reorder
app.use('/api/surveys', surveyQuestionRoutes);

// Standalone question routes
// PUT /api/questions/:id
// DELETE /api/questions/:id
app.use('/api/questions', questionRoutes);

// Response routes nested under surveys
// POST /api/surveys/:surveyId/responses
// GET /api/surveys/:surveyId/responses
app.use('/api/surveys', surveyResponseRoutes);

// Standalone response routes
// GET /api/responses/my
// GET /api/responses/:id
// DELETE /api/responses/:id
app.use('/api/responses', responseRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler for unknown routes
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', err);

    // Don't expose internal errors in production
    const isDevelopment = process.env.NODE_ENV !== 'production';

    res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(isDevelopment && { error: err.message, stack: err.stack })
    });
});

// ============================================
// SERVER STARTUP
// ============================================

app.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Survey System API Server`);
    console.log(`📍 Running on: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('========================================');
    console.log('Available endpoints:');
    console.log('  GET  /health              - Health check');
    console.log('  GET  /api                 - API info');
    console.log('  POST /api/auth/register   - Register user');
    console.log('  POST /api/auth/login      - Login user');
    console.log('  GET  /api/auth/me         - Get current user');
    console.log('  *    /api/surveys/*       - Survey management');
    console.log('  *    /api/questions/*     - Question management');
    console.log('  *    /api/responses/*     - Response management');
    console.log('========================================');
});

export default app;
