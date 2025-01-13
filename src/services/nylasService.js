import axios from "axios";

export const connectEmailWithNylas = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to connect with Nylas.");
    }

    // Call the `/auth` endpoint on the backend
    const response = await axios.get("http://localhost:3001/nylas/oauth", {
      params: { userId },
    });

    const authUrl = response.data.authUrl;

    if (response.status !== 200 || !authUrl) {
      throw new Error("Failed to authenticate using Nylas.");
    }

    window.location.href = authUrl;

    return { success: "Redirecting to Nylas authentication page" };
  } catch (error) {
    console.error("Error connecting email with Nylas:", error);

    return { error: "Error connecting email" };
  }
};
