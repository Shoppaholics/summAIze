import React, { useState } from "react";
import PropTypes from "prop-types";

const EmailCountPopup = ({ onSubmit, onClose }) => {
  const [emailCount, setEmailCount] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(emailCount);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Fetch Emails</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="emailCount">
              Number of emails to fetch and summarize:
            </label>
            <input
              type="number"
              id="emailCount"
              min="1"
              max="50"
              value={emailCount}
              onChange={(e) => setEmailCount(parseInt(e.target.value))}
            />
          </div>
          <div className="popup-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Summarize
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EmailCountPopup.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EmailCountPopup;
