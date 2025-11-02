const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile)
  .delete(deleteUserAccount);

module.exports = router;
