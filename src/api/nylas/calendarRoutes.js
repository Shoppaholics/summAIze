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

    const calendars = [];
    for (const provider of data) {
      try {
        const calendarList = await nylas.calendars.list({
          identifier: provider.nylas_grant_id,
          limit: 5,
        });
        calendars.push({
          email: provider.email,
          provider: provider.provider,
          calendars: calendarList.data,
          errror: null,
        });
      } catch (error) {
        console.error("Error fetching calendar", error);
        calendars.push({
          email: provider.email,
          provider: provider.provider,
          calendars: null,
          error: "Error fetching calendars",
        });
      }
    }
    return res.status(200).json(calendars);
  } catch (error) {
    console.error("Error fetching calendar:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route: Fetch events for calendar
router.post("/get-events", async (req, res) => {
  const { grantId, calendarId } = req.body;

  if (!grantId) {
    return res.status(400).json({ error: "Grant ID is required" });
  }
  if (!calendarId) {
    return res.status(400).json({ error: "Calendar ID is required" });
  }

  try {
    const events = await nylas.events.list({
      identifier: grantId,
      queryParams: {
        calendarId: calendarId,
      },
    });

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events for calendar:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route: Create task for calendar
router.post("/create-task", async (req, res) => {
  const { grantId, calendarId, title, description, startTime } = req.body;

  if (!grantId) {
    return res.status(400).json({ error: "Grant ID is required" });
  }
  if (!calendarId) {
    return res.status(400).json({ error: "Calendar ID is required" });
  }
  try {
    const task = await nylas.events.create({
      identifier: grantId,
      requestBody: {
        title: title,
        when: {
          time: startTime,
        },
        description: description,
      },
      queryParams: {
        calendarId: calendarId,
      },
    });

    return res.status(200).json(task);
  } catch (error) {
    console.error("Error creating task for calendar:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route: Create event for calendar
router.post("/create-event", async (req, res) => {
  const {
    grantId,
    calendarId,
    title,
    description,
    participants,
    startTime,
    endTime,
  } = req.body;

  if (!grantId) {
    return res.status(400).json({ error: "Grant ID is required" });
  }
  if (!calendarId) {
    return res.status(400).json({ error: "Calendar ID is required" });
  }
  try {
    const event = await nylas.events.create({
      identifier: grantId,
      requestBody: {
        title: title,
        when: {
          startTime: Math.floor(startTime / 1000),
          endTime: Math.floor(endTime / 1000),
        },
        description: description,
        participants: participants,
      },
      queryParams: {
        calendarId: calendarId,
      },
    });

    return res.status(200).json(event);
  } catch (error) {
    console.error("Error creating event for calendar:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route: Check availability for all participants
router.post("/check-availability", async (req, res) => {
  const { participants, startTime, endTime, duration } = req.body;

  if (!participants) {
    return res.status(400).json({ error: "Participants required" });
  }
  if (!startTime || !endTime) {
    return res.status(400).json({ error: "Start time and End time required" });
  }
  if (!duration) {
    return res
      .status(400)
      .json({ error: "Duration to check availability for is required" });
  }

  try {
    const calendar = await nylas.calendars.getAvailability({
      requestBody: {
        startTime: startTime,
        endTime: endTime,
        duration_minutes: duration,
        participants: participants,
      },
    });

    return res.status(200).json(calendar.data);
  } catch (error) {
    console.error("Error checking availability for participants:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
