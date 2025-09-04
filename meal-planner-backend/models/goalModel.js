const db = require('../config/db');

// Set (tạo hoặc cập nhật) mục tiêu
exports.setGoal = async (userId, goal_type, amount, unit) => {
  const sql = `
    INSERT INTO goals (user_id, goal_type, amount, unit)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      goal_type = VALUES(goal_type),
      amount = VALUES(amount),
      unit = VALUES(unit)
  `;
  await db.promise().query(sql, [userId, goal_type, amount, unit]);
};

// Lấy mục tiêu theo userId
exports.getGoalByUserId = async (userId) => {
  const sql = 'SELECT * FROM goals WHERE user_id = ? LIMIT 1';
  const [rows] = await db.promise().query(sql, [userId]);
  return rows.length ? rows[0] : null;
};
