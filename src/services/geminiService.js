import { summarizeAndExtractWithGemini } from "../api/geminiai.js";
import { fetchEmails } from "./emailService.js";

export const summarizeEmails = async (userId, emailCount) => {
  try {
    const { connectedEmails, error } = await fetchEmails(userId, emailCount);

    if (error || !connectedEmails) {
      console.warn("Failed to fetch emails:", error);
      return { error: "Failed to fetch emails" };
    }

    // Process emails with Gemini
    const summary = await Promise.all(
      connectedEmails
        .flatMap((account) =>
          (account.messages || []).map(async (message) => {
            try {
              const aiSummary = await summarizeAndExtractWithGemini(
                message.body || message.snippet
              );
              return {
                from: message.fromName || message.from,
                subject: message.subject || "No Subject",
                summary: aiSummary,
                messageUrl: message.messageUrl,
                provider: message.provider,
                grantId: message.grantId,
              };
            } catch (err) {
              console.error("Error summarizing email:", err);
              return null;
            }
          })
        )
        .filter(Boolean) // Remove null values from failed summaries
    );

    return { summary };
  } catch (error) {
    console.error("Error in summarizeEmails:", error);
    return { error: "Error summarizing emails" };
  }
};
