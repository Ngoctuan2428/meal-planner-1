require('dotenv').config();
console.log('Gemini key path:', process.env.GEMINI_KEY_PATH);
const fs = require('fs');

fs.access(process.env.GEMINI_KEY_PATH, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('❌ File key không tồn tại:', process.env.GEMINI_KEY_PATH);
  } else {
    console.log('✅ File key tồn tại, sẵn sàng dùng Gemini API');
  }
});
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI({ keyFile: process.env.GEMINI_KEY_PATH });

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello Gemini!");
    console.log("Gemini trả lời:", result.response.text());
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);
  }
}

testGemini();
