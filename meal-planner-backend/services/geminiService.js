const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');
require('dotenv').config();

// =======================
//  Vertex AI Initialization
// =======================
const vertexAI = new VertexAI({
  project: 'mealactivityplanner',
  location: 'us-central1',
  keyFilename: path.resolve(__dirname, '..', process.env.GEMINI_KEY_PATH) // ./keys/gemini-service-account.json
});

const textModel = vertexAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
const imageModel = vertexAI.getGenerativeModel({ model: 'gemini-1.5-pro-vision' });

// =======================
//  Helpers
// =======================
function safeJSONParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    console.error('⚠️ JSON parse failed. Raw text:', raw);
    return null;
  }
}

function extractCalories(text) {
  const match = text?.match(/\d+(\.\d+)?/);
  if (!match) return null;
  const value = parseFloat(match[0]);
  return value > 0 && value < 5000 ? value : null;
}

async function generateFromModel(model, prompt, parts = []) {
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [...parts, { text: prompt }] }]
  });

  return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// =======================
//  Features
// =======================

/**
 * Create meal plan
 */
exports.generateMealPlan = async (calories, meals) => {
  if (!Number.isFinite(calories) || calories <= 0 || !Number.isInteger(meals) || meals <= 0) {
    throw new Error('Invalid calories or meals count');
  }

  const prompt = `Create a ${meals}-meal plan for one day with a total of about ${calories} calories. 
  Return strictly in JSON format. Each meal should include: name, estimatedCalories.`;

  try {
    const text = await generateFromModel(textModel, prompt);
    const json = safeJSONParse(text);
    return Array.isArray(json) ? json : [];
  } catch (err) {
    console.error('❌ Failed to generate meal plan:', err);
    return [];
  }
};

/**
 * Create workout plan
 */
exports.generateWorkoutPlan = async (goal) => {
  if (!goal || typeof goal !== 'string' || goal.trim().length < 3) {
    throw new Error('Invalid workout goal');
  }

  const prompt = `Generate a workout plan for a user whose goal is to ${goal}. 
  Return strictly in JSON format. Each exercise must include: name, duration, description.`;

  try {
    const text = await generateFromModel(textModel, prompt);
    const json = safeJSONParse(text);
    return Array.isArray(json) ? json : [];
  } catch (err) {
    console.error('❌ Failed to generate workout plan:', err);
    return [];
  }
};

/**
 * Estimate calories from text
 */
exports.estimateCaloriesFromText = async (description) => {
  if (!description || typeof description !== 'string' || description.trim().length < 3) {
    throw new Error('Invalid food description');
  }

  const prompt = `Estimate calories in this food description: "${description}". Only return a number.`;

  try {
    const text = await generateFromModel(textModel, prompt);
    return extractCalories(text);
  } catch (err) {
    console.error('❌ Failed to estimate calories from text:', err);
    return null;
  }
};

/**
 * Estimate calories from image
 */
exports.estimateCaloriesFromImage = async (base64Image) => {
  if (!base64Image || typeof base64Image !== 'string') {
    throw new Error('Invalid image data');
  }

  const prompt = "Estimate the calories of the food in this image. Only return a number.";

  try {
    const result = await imageModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
            { text: prompt }
          ]
        }
      ]
    });

    const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return extractCalories(text);
  } catch (err) {
    console.error('❌ Failed to estimate calories from image:', err);
    return null;
  }
};
