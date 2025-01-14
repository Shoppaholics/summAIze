import PropTypes from "prop-types";
import React from "react";

const EventCard = ({ title }) => {
  return <div>Event: {title}</div>;
};

EventCard.propTypes = {
  title: PropTypes.string.isRequired, // Required string
  date: PropTypes.string, // Optional string
  location: PropTypes.string, // Optional string
};

export default EventCard;
