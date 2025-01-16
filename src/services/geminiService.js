import { summarizeAndExtractWithGemini } from "../api/geminiai.js";

import { fetchEmails } from "./emailService.js";

console.log("Start:");
export const summarizeEmails = async (userId) => {
  console.log("SummarizeEmails called with userId:", userId);
  try {
    const { connectedEmails } = await fetchEmails(userId);
    console.log("Fetched emails:", connectedEmails);

    if (!connectedEmails || !Array.isArray(connectedEmails)) {
      console.warn("Fetched emails are invalid or empty");
      return { connectedEmails: [] };
    }

    const summarizedEmails = await Promise.all(
      connectedEmails.map(async (email) => {
        try {
          const messagesList = email.emails.data;
          const summarizedMessages = await Promise.all(
            messagesList.map(async (message) => {
              try {
                const summary = await summarizeAndExtractWithGemini(
                  message.body
                );
                return { ...message, summary };
              } catch (error) {
                console.error(
                  "Error summarizing message ${message.id}:",
                  error
                );
                return { ...message, summary: "Error generating summary" };
              }
            })
          );
          return {
            ...email,
            emails: { ...email.emails, data: summarizedMessages },
          };
        } catch (err) {
          console.error(`Error summarizing email ${email.id}:`, err);
          return { ...email, summary: "Error generating summary" }; // Fallback
        }
      })
    );

    console.log("New format: ", summarizedEmails);
    //console.log("Summarized emails:", summarizedEmails);
    return { emails: summarizedEmails };
  } catch (error) {
    console.error("Error in summarizeEmails function:", error);
    return { error: "Error summarizing emails" };
  }
};
