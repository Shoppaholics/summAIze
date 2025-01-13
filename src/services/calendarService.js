import axios from "axios";

export const fetchCalendars = async (userId) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/nylas/calendar/get",
      {
        params: { userId },
      }
    );
    return { fetchedCalendars: response.data };
  } catch (error) {
    console.error("Error fetching calendars:", error);
    return { error: "Error fetching emails" };
  }
};
