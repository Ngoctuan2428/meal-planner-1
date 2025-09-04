const db = require('../config/db');

// Lưu bài tập kèm user_id (có validate)
exports.saveWorkout = async (workout) => {
  if (!workout.name?.trim() || typeof workout.duration !== 'number') {
    throw new Error('Invalid workout data');
  }

  const sql = `
    INSERT INTO workouts (name, duration, description, user_id)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await db.promise().query(sql, [
    workout.name.trim(),
    workout.duration,
    workout.description || '',
    workout.user_id
  ]);

  return result;
};

// Lấy tất cả bài tập của 1 người dùng (mới nhất trước)
exports.getWorkoutsByUser = async (userId) => {
  const sql = `
    SELECT * FROM workouts
    WHERE user_id = ?
    ORDER BY id DESC
  `;
  const [rows] = await db.promise().query(sql, [userId]);
  return rows;
};
