import axios from "axios";

export const fetchEmails = async (userId, count) => {
  try {
    const response = await axios.get("http://localhost:3001/nylas/email/read", {
      params: {
        userId,
        count,
      },
    });

    // Clean up the response data structure
    const emails = response.data.map((emailAccount) => ({
      email: emailAccount.emailAddress,
      messages: emailAccount.emails?.data || [],
      error: emailAccount.error,
    }));

    return { connectedEmails: emails };
  } catch (error) {
    console.error("Error fetching emails:", error);
    return { error: "Error fetching emails" };
  }
};
