const calorieEstimator = require('../services/calorieEstimator');
const fs = require('fs');

function sendCalorieResponse(res, result) {
  const calories = parseFloat(result.calories || result);
  if (isNaN(calories)) {
    return res.status(500).json({ message: 'Invalid calorie value from service' });
  }
  res.json({
    success: true,
    calories,
    details: result.details || null
  });
}

exports.estimateCaloriesFromImage = async (req, res) => {
  try {
    if (!req.file || !(req.file.path || req.file.buffer)) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imagePath = req.file.path || null;
    const imageBuffer = req.file.buffer || null;

    const result = imagePath
      ? await calorieEstimator.estimateFromImage(imagePath)
      : await calorieEstimator.estimateFromBuffer(imageBuffer);

    if (imagePath) {
      fs.unlink(imagePath, (err) => {
        if (err) console.error('⚠️ Failed to delete temp image:', err);
      });
    }

    sendCalorieResponse(res, result);
  } catch (error) {
    console.error('❌ Error estimating from image:', error.stack || error);
    res.status(500).json({ message: 'Failed to estimate calories from image' });
  }
};

exports.estimateCaloriesFromText = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ message: 'Description must be a non-empty string' });
    }

    const result = await calorieEstimator.estimateFromText(description.trim());
    sendCalorieResponse(res, result);
  } catch (error) {
    console.error('❌ Error estimating from text:', error.stack || error);
    res.status(500).json({ message: 'Failed to estimate calories from text' });
  }
};
