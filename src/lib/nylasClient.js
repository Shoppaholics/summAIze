import dotenv from "dotenv";
import Nylas from "nylas";

dotenv.config({ path: "../../.env" });

if (!process.env.NYLAS_CLIENT_ID || !process.env.NYLAS_API_KEY) {
  throw new Error(
    "Missing Nylas Client ID or Client Secret in environment variables"
  );
}

export const nylasConfig = {
  clientId: process.env.NYLAS_CLIENT_ID,
  apiKey: process.env.NYLAS_API_KEY,
  apiUri: process.env.NYLAS_API_URI,
  callbackUri: "http://localhost:3001/nylas/oauth/exchange",
};

export const nylas = new Nylas({
  apiKey: nylasConfig.apiKey,
  apiUri: nylasConfig.apiUri,
});
