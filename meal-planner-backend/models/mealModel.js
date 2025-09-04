const db = require('../config/db');

// Thêm món ăn mới
exports.saveMeal = async (meal) => {
  if (!meal.name?.trim() || typeof meal.calories !== 'number') {
    throw new Error('Invalid meal data');
  }

  const sql = `
    INSERT INTO meals (name, calories, image_url)
    VALUES (?, ?, ?)
  `;
  const [result] = await db.promise().query(sql, [
    meal.name.trim(),
    meal.calories,
    meal.image_url || null
  ]);

  return { insertId: result.insertId };
};

// Lấy tất cả món ăn (có phân trang, có sắp xếp)
exports.getAllMeals = async (limit = 50, offset = 0) => {
  const sql = `
    SELECT * FROM meals
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `;
  const [rows] = await db.promise().query(sql, [limit, offset]);
  return rows;
};

// Lấy món ăn theo id
exports.getMealById = async (id) => {
  const sql = 'SELECT * FROM meals WHERE id = ?';
  const [rows] = await db.promise().query(sql, [id]);
  return rows[0] || null;
};

// Xoá món ăn theo id
exports.deleteMeal = async (id) => {
  const sql = 'DELETE FROM meals WHERE id = ?';
  const [result] = await db.promise().query(sql, [id]);
  return { affectedRows: result.affectedRows };
};

// Cập nhật món ăn theo id
exports.updateMeal = async (id, meal) => {
  if (!meal.name?.trim() || typeof meal.calories !== 'number') {
    throw new Error('Invalid meal data');
  }

  const sql = `
    UPDATE meals
    SET name = ?, calories = ?, image_url = ?
    WHERE id = ?
  `;
  const [result] = await db.promise().query(sql, [
    meal.name.trim(),
    meal.calories,
    meal.image_url || null,
    id
  ]);

  return { affectedRows: result.affectedRows };
};
