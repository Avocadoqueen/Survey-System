/**
 * Database Configuration
 * MySQL connection pool setup using mysql2
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool for better performance
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'survey_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Enable JSON parsing for JSON columns
    typeCast: function (field, next) {
        if (field.type === 'JSON') {
            return JSON.parse(field.string());
        }
        return next();
    }
});

// Test connection on startup
pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

export default pool;
