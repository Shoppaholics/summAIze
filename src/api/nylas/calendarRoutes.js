import express from "express";

import { nylas } from "../../lib/nylasClient.js";
import { supabase } from "../../lib/supabaseClientBackend.js";

const router = express.Router();

// Route: Fetch calendars
router.get("/get", async (req, res) => {
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

    let calendars = [];
    for (const provider of data) {
      try {
        const calendarList = await nylas.calendars.list({
          identifier: provider.nylas_grant_id,
          limit: 5,
        });
        calendars = [
          ...calendars,
          {
            email: provider.email,
            provider: provider.provider,
            calendars: calendarList,
            errror: null,
          },
        ];
      } catch (error) {
        console.error("Error fetching calendar", error);
        calendars = [
          ...calendars,
          {
            email: provider.email,
            provider: provider.provider,
            calendars: null,
            error: "Error fetching calendars",
          },
        ];
      }
    }
    return res.status(200).json(calendars);
  } catch (error) {
    console.error("Error fetching calendar:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
