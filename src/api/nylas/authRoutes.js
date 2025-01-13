import express from "express";

import { supabase } from "../../lib/supabaseClientBackend.js";
import { nylas, nylasConfig } from "../../lib/nylasClient.js";

const router = express.Router();

// Route: Generate Nylas OAuth URL
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const authUrl = nylas.auth.urlForOAuth2({
      redirectUri: nylasConfig.callbackUri,
      clientId: nylasConfig.clientId,
      scope: ["email", "calendar", "contacts"],
      state: userId, // To identify the user after callback
      accessType: "offline",
    });

    return res.status(200).json({ authUrl: authUrl });
  } catch (error) {
    console.error("Failed to generate nylas auth URL:", error);

    return res.status(500).json({
      error: "An error occurred while generating the authentication URL.",
      details: error.message,
    });
  }
});

// Route: Callback for Nylas OAuth
router.get("/exchange", async (req, res) => {
  const { code, state: userId } = req.query; // Extract authorization code and user ID
  if (!code || !userId) {
    return res
      .status(400)
      .json({ error: "Authorization code and user ID are required" });
  }

  try {
    // Exchange code for access token
    const response = await nylas.auth.exchangeCodeForToken({
      clientSecret: nylasConfig.apiKey,
      clientId: nylasConfig.clientId,
      redirectUri: nylasConfig.callbackUri,
      code,
    });
    const { grantId } = response;

    // Retrieve user's Nylas account details
    const account = await nylas.grants.find({ grantId });
    const { id, provider, email } = account.data;

    // Save Nylas details to Supabase
    const { error } = await supabase.from("user_nylas").upsert(
      {
        user_id: userId,
        nylas_grant_id: grantId,
        email: email,
        provider: provider,
      },
      {
        onConflict: "nylas_grant_id",
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).redirect("http://localhost:3000");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
