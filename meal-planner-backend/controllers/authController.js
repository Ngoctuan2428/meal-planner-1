const db = require('../config/db');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

// Đăng ký
exports.register = async (req, res) => {
  try {
    let { username, email, password, confirmPassword } = req.body;

    username = username?.trim();
    email = email?.trim();

    // Kiểm tra dữ liệu bắt buộc
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Kiểm tra username hoặc email đã tồn tại
    const [existing] = await db.promise().query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu user vào DB
    await db.promise().query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    return res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('❌ Registration error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    let { identifier, password } = req.body; // Nhận email hoặc username
    identifier = identifier?.trim();

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' });
    }

    // Tìm user theo email hoặc username
    const [users] = await db.promise().query(
      'SELECT id, username, email, password FROM users WHERE email = ? OR username = ?',
      [identifier, identifier]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
      token
    });

  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
};
