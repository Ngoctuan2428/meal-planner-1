const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Middleware bọc async để tự động bắt lỗi
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));

module.exports = router;
