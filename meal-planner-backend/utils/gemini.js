const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ Missing GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function generateMealPlan(prompt) {
  try {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error("Prompt must be a non-empty string");
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating meal plan:", error.message);
    return "⚠️ Unable to generate meal plan at the moment.";
  }
}

module.exports = {
  generateMealPlan,
};
