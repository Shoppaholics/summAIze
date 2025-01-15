import { summarizeAndExtractWithGemini } from "../api/geminiai.js";

import { fetchEmails } from "./emailService.js";

export const summarizeEmails = async (userId) => {
  try {
    const { emails } = await fetchEmails(userId);

    const summarizedEmails = await Promise.all(
      emails.map(async (email) => {
        const summary = await summarizeAndExtractWithGemini(email.body);
        return { ...email, summary };
      })
    );
    console.log("summarizedEmails with Gemini", summarizedEmails);
  } catch (error) {
    console.error("Error summarizing or extracting emails:", error);
  }
};
