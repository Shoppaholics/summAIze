import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing Gemini API Key in enviroment veriables");
}

export const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY,
};
console.log("Gemini instance initialized:", gemini);

export const gemini = new GoogleGenerativeAI(geminiConfig.apiKey);
