import { summarizeAndExtractWithGemini } from "../api/geminiai.js";

import { fetchEmails } from "./emailService.js";

console.log("Start:");
export const summarizeEmails = async (userId) => {
  console.log("SummarizeEmails called with userId:", userId);
  try {
    const { emails } = await fetchEmails(userId);
    console.log("Fetched emails:", emails);

    if (!emails || !Array.isArray(emails)) {
      console.warn("Fetched emails are invalid or empty");
      return { emails: [] };
    }

    const summarizedEmails = await Promise.all(
      emails.map(async (email) => {
        try {
          const summary = await summarizeAndExtractWithGemini(email.body);
          console.log(`Summary for email ${email.id}:`, summary);
          return { ...email, summary };
        } catch (err) {
          console.error(`Error summarizing email ${email.id}:`, err);
          return { ...email, summary: "Error generating summary" }; // Fallback
        }
      })
    );

    console.log("Summarized emails:", summarizedEmails);
    return { emails: summarizedEmails };
  } catch (error) {
    console.error("Error in summarizeEmails function:", error);
    return { error: "Error summarizing emails" };
  }
};
