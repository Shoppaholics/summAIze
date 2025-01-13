import express from "express";

import { supabase } from "../../lib/supabaseClientBackend.js";
import { nylas, nylasConfig } from "../../lib/nylasClient.js";

const router = express.Router();

// Route: Fetch emails
router.get("/read", async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Fetch user's Nylas grant ids from Supabase
    const { data, error } = await supabase
      .from("user_nylas")
      .select("nylas_grant_id, email, provider")
      .eq("user_id", userId);

    if (error) {
      console.error(error.stack);
      return { error: "Error getting Nylas grant ids" };
    }

    let retrievedEmails = [];

    for (const email of data) {
      try {
        const messages = await nylas.messages.list({
          identifier: email.nylas_grant_id,
          queryParams: {
            limit: 5,
          },
        });
        retrievedEmails = [
          ...retrievedEmails,
          { emailAddress: email.email, emails: messages, error: null },
        ];
      } catch (error) {
        retrievedEmails = [
          ...retrievedEmails,
          {
            emailAddress: email.email,
            emails: null,
            error: "Error retrieving emails",
          },
        ];
      }
    }

    return res.status(200).json(retrievedEmails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
