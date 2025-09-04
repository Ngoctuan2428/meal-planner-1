// ==== Import thư viện ====
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const { VertexAI } = require('@google-cloud/vertexai');
require('dotenv').config();

// ==== Đọc biến môi trường từ .env ====
const PROJECT_ID = process.env.GOOGLE_PROJECT_ID; // mealactivityplanner
const LOCATION = process.env.GOOGLE_LOCATION || 'us-central1';
const GEMINI_KEY_PATH = process.env.GEMINI_KEY_PATH; // ./keys/gemini-service-account.json

if (!PROJECT_ID || !GEMINI_KEY_PATH) {
  throw new Error('❌ Thiếu GOOGLE_PROJECT_ID hoặc GEMINI_KEY_PATH trong file .env');
}

// ==== Khởi tạo Gemini ====
const vertexAI = new VertexAI({
  project: PROJECT_ID,
  location: LOCATION,
  keyFilename: path.resolve(__dirname, '..', GEMINI_KEY_PATH)
});

const textModel = vertexAI.getGenerativeModel({
  model: process.env.GEMINI_TEXT_MODEL || 'gemini-1.5-pro'
});

const visionModel = vertexAI.getGenerativeModel({
  model: process.env.GEMINI_VISION_MODEL || 'gemini-1.5-pro-vision'
});

// ==== Helper functions ====
const safeJSONParse = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const extractCalories = (text) => {
  const match = text?.match(/\d+(\.\d+)?/);
  if (!match) return null;
  const value = parseFloat(match[0]);
  return value > 0 && value < 5000 ? value : null;
};

const generateFromModel = async (model, contents) => {
  const result = await model.generateContent({ contents });
  return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

const prepareImageBase64 = async (input) => {
  let buffer;
  if (Buffer.isBuffer(input)) {
    buffer = input;
  } else if (typeof input === 'string') {
    buffer = await fs.readFile(input);
  } else {
    throw new Error('Invalid image input type');
  }

  // Resize ảnh để tối ưu
  buffer = await sharp(buffer)
    .resize({ width: 1024, height: 1024, fit: 'inside' })
    .toBuffer();

  const { format } = await sharp(buffer).metadata();
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';

  return { mimeType, base64: buffer.toString('base64') };
};

// ==== API: Ước lượng calo từ mô tả text ====
exports.estimateFromText = async (description) => {
  if (!description || typeof description !== 'string') {
    throw new Error('Invalid description');
  }

  const prompt = `
    Estimate total calories for: "${description}"
    Return JSON ONLY in format: {"calories": number, "details": "short explanation"}.
  `;

  try {
    const text = await generateFromModel(textModel, [
      { role: 'user', parts: [{ text: prompt }] }
    ]);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let calories = null, details = null;

    if (jsonMatch) {
      const parsed = safeJSONParse(jsonMatch[0]);
      if (parsed && !isNaN(parsed.calories)) {
        calories = parseFloat(parsed.calories);
        details = parsed.details || null;
      }
    }

    if (!calories) {
      calories = extractCalories(text);
      details = text;
    }

    if (!calories) throw new Error('Could not extract calories');

    return { calories, details };
  } catch (err) {
    console.error('❌ estimateFromText failed:', err.message);
    return null;
  }
};

// ==== API: Ước lượng calo từ ảnh ====
exports.estimateFromImage = async (imagePathOrBuffer) => {
  try {
    const { mimeType, base64 } = await prepareImageBase64(imagePathOrBuffer);

    const prompt = 'Describe the food in this image in detail.';
    const description = await generateFromModel(visionModel, [
      {
        role: 'user',
        parts: [
          { inlineData: { mimeType, data: base64 } },
          { text: prompt }
        ]
      }
    ]);

    console.log('🖼 Gemini description:', description);

    return await exports.estimateFromText(description);
  } catch (err) {
    console.error('❌ estimateFromImage failed:', err.message);
    return null;
  }
};

// ==== API: Ước lượng calo từ buffer ảnh ====
exports.estimateFromBuffer = async (buffer) => {
  return exports.estimateFromImage(buffer);
};
