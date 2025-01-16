import axios from "axios";

export const fetchEmails = async (userId) => {
  try {
    const response = await axios.get("http://localhost:3001/nylas/email/read", {
      params: { userId },
    });

    const { connectedEmails } = response.data;
    console.log("Email format: ", connectedEmails);
    return { connectedEmails: response.data };
  } catch (error) {
    console.error(error);
    return { error: "Error fetching emails" };
  }
};
