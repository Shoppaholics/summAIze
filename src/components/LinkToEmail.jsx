import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const LinkToEmail = ({ messageUrl, provider }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3001/nylas/email/auth-url",
        {
          params: {
            messageUrl,
            provider,
          },
        }
      );

      if (response.data.url) {
        window.open(response.data.url, "_blank");
      } else {
        throw new Error("No URL returned from server");
      }
    } catch (error) {
      console.error("Error opening email:", error.response?.data || error);
      alert(
        error.response?.data?.error || "Failed to open email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="email-link-button"
      disabled={isLoading}
    >
      {isLoading ? "Opening..." : "View Email"}
    </button>
  );
};

LinkToEmail.propTypes = {
  messageUrl: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
};

export default LinkToEmail;
