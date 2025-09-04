const workoutModel = require('../models/workoutModel');
const workoutLogModel = require('../models/workoutLogModel');
const geminiService = require('../services/geminiService');
const goalModel = require('../models/goalModel');

exports.generateWorkoutPlan = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }

    // Lấy mục tiêu người dùng
    const goal = await goalModel.getGoalByUserId(userId);
    if (!goal) {
      return res.status(404).json({ message: 'No goal found for user' });
    }

    const prompt = `Create a weekly workout plan for a person whose goal is to ${goal.goal_type} ${goal.amount}${goal.unit}. Return in JSON array with name, duration (in minutes), and description.`;

    let workouts;
    try {
      workouts = await geminiService.generateWorkoutPlan(prompt);
      if (typeof workouts === 'string') {
        workouts = JSON.parse(workouts);
      }
      if (!Array.isArray(workouts)) {
        throw new Error('AI did not return an array');
      }
    } catch (genErr) {
      console.error('❌ Error generating/parsing AI workout plan:', genErr);
      return res.status(500).json({ message: 'Invalid AI workout response' });
    }

    const logTime = new Date();

    // Lưu tất cả workout song song
    await Promise.all(
      workouts.map(async (workout) => {
        const { insertId: workoutId } = await workoutModel.saveWorkout({
          ...workout,
          user_id: userId
        });
        await workoutLogModel.logWorkout(userId, workoutId, logTime);
      })
    );

    res.json({ success: true, workouts });
  } catch (error) {
    console.error('❌ generateWorkoutPlan error:', error);
    res.status(500).json({ message: 'Failed to generate workout plan' });
  }
};
