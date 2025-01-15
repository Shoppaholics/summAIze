import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_CLOUD_PROJECT) {
  throw new Error("Missing Gemini API Key in enviroment veriables");
}

export const geminiConfig = {
  apiKey: process.env.GOOGLE_CLOUD_PROJECT,
};

export const gemini = new GoogleGenerativeAI(geminiConfig.apiKey);
