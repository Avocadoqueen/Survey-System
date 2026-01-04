import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../model/usermodel';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, username } = req.body;

    // Validate required fields
    if (!email || !password || !name || !username) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['email', 'password', 'name', 'username']
      });
    }

    // Check if user exists (Sequelize syntax)
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (Sequelize syntax)
    const user = await UserModel.create({
      email,
      password: hashedPassword,
      name,
      username
    });

    // Generate token (using user_id instead of _id)
    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: { id: user.user_id, email: user.email, name: user.name },
      token
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Better error handling for Sequelize errors
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error?.name === 'SequelizeValidationError') {
      errorMessage = error.errors?.map((e: any) => e.message).join(', ') || 'Validation error';
    } else if (error?.name === 'SequelizeUniqueConstraintError') {
      errorMessage = 'User with this email or username already exists';
    } else if (error?.name === 'SequelizeDatabaseError') {
      errorMessage = 'Database error: ' + error.message;
    }
    
    res.status(500).json({ 
      message: 'Error registering user', 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user (Sequelize syntax)
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token (using user_id instead of _id)
    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: { id: user.user_id, email: user.email, name: user.name },
      token
    });
  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ 
      message: 'Error logging in', 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
});

export default router;
