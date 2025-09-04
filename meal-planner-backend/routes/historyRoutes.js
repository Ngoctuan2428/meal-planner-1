const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.get('/:userId', (req, res, next) => {
  const { userId } = req.params;
  if (!Number.isInteger(Number(userId))) {
    return res.status(400).json({ message: 'Invalid userId' });
  }
  next();
}, historyController.getHistory);

module.exports = router;
