const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/generate', asyncHandler(mealController.generateMeals));

module.exports = router;
