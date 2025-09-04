const db = require('../config/db');
const bcrypt = require('bcrypt');

// Tạo user mới
exports.createUser = async (username, email, password) => {
  username = username.trim();
  email = email.trim().toLowerCase();

  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `
    INSERT INTO users (username, email, password)
    VALUES (?, ?, ?)
  `;
  const [result] = await db.promise().query(sql, [username, email, hashedPassword]);
  return { insertId: result.insertId };
};

// Lấy user theo username
exports.getUserByUsername = async (username) => {
  const sql = 'SELECT * FROM users WHERE username = ? LIMIT 1';
  const [rows] = await db.promise().query(sql, [username.trim()]);
  return rows[0] || null;
};

// Lấy user theo email
exports.getUserByEmail = async (email) => {
  const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  const [rows] = await db.promise().query(sql, [email.trim().toLowerCase()]);
  return rows[0] || null;
};

// Kiểm tra username hoặc email tồn tại
exports.checkUserExists = async (username, email) => {
  const sql = 'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1';
  const [rows] = await db.promise().query(sql, [
    username.trim(),
    email.trim().toLowerCase()
  ]);
  return rows.length > 0;
};
