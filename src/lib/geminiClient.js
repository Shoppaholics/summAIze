import { GoogleGenerativeAI } from "@google/generative-ai";

export const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

console.log("API key:", apiKey);

if (!apiKey) {
  throw new Error("Missing Gemini API Key in enviroment variables");
}

export const gemini = new GoogleGenerativeAI({
  apiKey: apiKey,
});

console.log("Gemini instance initialized:", gemini);
