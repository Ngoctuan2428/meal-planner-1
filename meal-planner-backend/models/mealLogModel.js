const db = require('../config/db');

// Ghi lại meal log mới
const logMeal = async (userId, mealId, date) => {
  const sql = 'INSERT INTO meal_logs (user_id, meal_id, date) VALUES (?, ?, ?)';
  const [result] = await db.promise().query(sql, [userId, mealId, date]);
  return result;
};

// Lấy tất cả meal logs của user kèm tên bữa ăn & calories
const getMealLogsByUser = async (userId) => {
  const sql = `
    SELECT ml.*, m.name AS meal_name, m.calories
    FROM meal_logs ml
    JOIN meals m ON ml.meal_id = m.id
    WHERE ml.user_id = ?
  `;
  const [rows] = await db.promise().query(sql, [userId]);
  return rows;
};

module.exports = {
  logMeal,
  getMealLogsByUser,
};
