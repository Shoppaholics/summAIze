import axios from "axios";

export const fetchEmails = async (userId) => {
  try {
    const response = await axios.get("http://localhost:3001/nylas/email/read", {
      params: { userId },
    });

    return { emails: response.data };
  } catch (error) {
    console.error(error);
    return { error: "Error fetching emails" };
  }
};
