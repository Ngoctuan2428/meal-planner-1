const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/generate', asyncHandler(workoutController.generateWorkoutPlan));

module.exports = router;
