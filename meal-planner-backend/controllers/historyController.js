const mealLogModel = require('../models/mealLogModel');
const workoutLogModel = require('../models/workoutLogModel');

exports.getHistory = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  // Kiểm tra userId hợp lệ
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  try {
    const [mealLogs, workoutLogs] = await Promise.all([
      mealLogModel.getMealLogsByUser(userId).catch(() => []),
      workoutLogModel.getWorkoutLogsByUser(userId).catch(() => [])
    ]);

    res.status(200).json({
      meals: Array.isArray(mealLogs) ? mealLogs : [],
      workouts: Array.isArray(workoutLogs) ? workoutLogs : []
    });
  } catch (err) {
    console.error('❌ History error:', err.sqlMessage || err.message || err);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};
