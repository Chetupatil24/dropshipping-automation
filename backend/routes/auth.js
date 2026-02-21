const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { generateToken } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');
const logger = require('../utils/logger');

// Register
router.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.validatedBody;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone
    });

    // Generate token
    const token = generateToken(user.id);

    logger.info('User registered:', { userId: user.id, email });

    res.status(201).json({
      user,
      token
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate token
    const token = generateToken(user.id);

    logger.info('User logged in:', { userId: user.id, email });

    res.json({
      user,
      token
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', require('../middleware/auth').auth, async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
