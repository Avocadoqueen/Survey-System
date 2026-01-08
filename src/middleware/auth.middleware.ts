/**
 * Authentication Middleware
 * Handles JWT token verification for protected routes
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user data
interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        user_id: number;
        email: string;
    };
}

// JWT payload structure
interface JWTPayload {
    userId: number;
    email?: string;
    iat: number;
    exp: number;
}

/**
 * Required authentication middleware
 * Verifies JWT token and attaches user to request
 * Returns 401 if token is missing or invalid
 */
export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Access token is required'
        });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jwt.verify(token, secret) as JWTPayload;

        req.user = {
            userId: decoded.userId,
            user_id: decoded.userId,
            email: decoded.email || ''
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
            return;
        }

        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'Failed to authenticate token'
        });
    }
};

/**
 * Optional authentication middleware
 * Verifies JWT token if present, but allows request to proceed without it
 * Useful for routes that have different behavior for authenticated vs anonymous users
 */
export const optionalAuth = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // No token provided, continue without user
        next();
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jwt.verify(token, secret) as JWTPayload;

        req.user = {
            userId: decoded.userId,
            user_id: decoded.userId,
            email: decoded.email || ''
        };
    } catch (error) {
        // Token invalid, but we allow the request to continue
        // User will just be undefined
        console.warn('Optional auth: Invalid token provided');
    }

    next();
};

export default { authenticateToken, optionalAuth };
