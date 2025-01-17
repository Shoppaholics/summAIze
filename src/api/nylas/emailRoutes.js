import express from "express";

import { nylas, nylasConfig } from "../../lib/nylasClient.js";
import { supabase } from "../../lib/supabaseClientBackend.js";

const router = express.Router();

// Route: Fetch emails
router.get("/read", async (req, res) => {
  const { userId, count } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("user_nylas")
      .select("nylas_grant_id, email, provider")
      .eq("user_id", userId);

    if (error) {
      console.error(error.stack);
      return res.status(500).json({ error: "Error getting Nylas grant ids" });
    }

    let retrievedEmails = [];

    for (const email of data) {
      try {
        const messages = await nylas.messages.list({
          identifier: email.nylas_grant_id,
          queryParams: {
            limit: parseInt(count),
          },
        });

        // Clean and format the messages
        const cleanedMessages = messages.data.map((message) => ({
          id: message.id,
          subject: message.subject,
          from: message.from[0]?.email,
          fromName: message.from[0]?.name,
          to: message.to.map((recipient) => ({
            email: recipient.email,
            name: recipient.name,
          })),
          date: new Date(message.date).toISOString(),
          body: message.body
            .replace(/<[^>]*>/g, "") // Remove HTML tags
            .replace(/&nbsp;/g, " ") // Replace HTML entities
            .replace(/\s+/g, " ") // Normalize whitespace
            .trim(),
          snippet: message.snippet,
          provider: email.provider,
          messageUrl: `https://mail.google.com/mail/u/0/#inbox/${message.id}`,
          grantId: email.nylas_grant_id,
        }));

        retrievedEmails.push({
          emailAddress: email.email,
          emails: {
            data: cleanedMessages,
          },
          error: null,
        });
      } catch (error) {
        console.error(error);
        retrievedEmails.push({
          emailAddress: email.email,
          emails: null,
          error: "Error retrieving emails",
        });
      }
    }

    return res.status(200).json(retrievedEmails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// Update the auth-url route
router.get("/auth-url", async (req, res) => {
  const { messageUrl, provider } = req.query;

  if (!messageUrl || !provider) {
    return res.status(400).json({
      error: "Missing required parameters",
      messageUrl,
      provider,
    });
  }

  try {
    let authUrl;
    switch (provider.toLowerCase()) {
      case "gmail":
      case "google":
        // Extract message ID from the full URL
        const messageId = messageUrl.match(/[^/]*$/)[0]; // Get everything after the last '/'
        authUrl = `https://mail.google.com/mail/u/0/#inbox/${messageId}`;
        break;
      case "outlook":
        authUrl = `https://outlook.office.com/mail/inbox/id/${messageUrl}`;
        break;
      default:
        return res.status(400).json({
          error: "Unsupported email provider",
          provider: provider,
        });
    }

    if (!authUrl) {
      return res.status(400).json({
        error: "Could not generate auth URL",
        messageUrl,
        provider,
      });
    }

    return res.json({ url: authUrl });
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return res.status(500).json({
      error: "Failed to generate authentication URL",
      details: error.message,
      messageUrl,
      provider,
    });
  }
});

export default router;
