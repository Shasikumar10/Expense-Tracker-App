const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, getMe, googleCallback } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/api/auth/google/error',
    session: false
  }),
  googleCallback
);

router.get('/google/error', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Google authentication failed'
  });
});

module.exports = router;
