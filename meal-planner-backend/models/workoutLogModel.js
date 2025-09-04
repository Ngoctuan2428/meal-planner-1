const db = require('../config/db');

// Ghi log bài tập
exports.logWorkout = (userId, workoutId, date, callback) => {
  const formattedDate = new Date(date)
    .toISOString()
    .slice(0, 19) // YYYY-MM-DDTHH:mm:ss
    .replace('T', ' ');

  const sql = `
    INSERT INTO workout_logs (user_id, workout_id, date)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [userId, workoutId, formattedDate], callback);
};

// Lấy log lịch sử luyện tập (có join workouts)
exports.getWorkoutLogsByUser = (userId, callback) => {
  const sql = `
    SELECT wl.*, w.name AS workout_name, w.duration, w.description
    FROM workout_logs wl
    JOIN workouts w ON wl.workout_id = w.id
    WHERE wl.user_id = ?
    ORDER BY wl.date DESC
  `;
  db.query(sql, [userId], callback);
};
