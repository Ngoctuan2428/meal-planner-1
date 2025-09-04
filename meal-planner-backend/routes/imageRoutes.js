const express = require('express');
const router = express.Router();
const multer = require('multer');
const imageController = require('../controllers/imageController');

// Cấu hình multer
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG and PNG are allowed'));
    }
    cb(null, true);
  }
});

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Route cho ảnh
router.post(
  '/estimate/image',
  upload.single('image'),
  asyncHandler(imageController.estimateCaloriesFromImage)
);

// Route cho mô tả văn bản
router.post(
  '/estimate/text',
  asyncHandler(imageController.estimateCaloriesFromText)
);

module.exports = router;
