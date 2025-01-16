import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.REACT_APP_GEMINI_API_KEY) {
  throw new Error("Missing Gemini API Key in enviroment veriables");
}

export const geminiConfig = {
  apiKey: process.env.REACT_APP_GEMINI_API_KEY,
};

export const gemini = new GoogleGenerativeAI(geminiConfig.apiKey);
