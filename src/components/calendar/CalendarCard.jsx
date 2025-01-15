import PropTypes from "prop-types";
import React from "react";

import EventCard from "./EventCard";

const CalendarCard = ({ calendar }) => {
  console.log("Calendar:", calendar);
  return (
    <div>
      <p className="font-medium text-lg mb-2">{calendar.name}</p>
      <div className="space-y-2">
        {calendar.events.length > 0 ? (
          calendar.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <p>No events</p>
        )}
      </div>
    </div>
  );
};

CalendarCard.propTypes = {
  calendar: PropTypes.object.isRequired,
};

export default CalendarCard;
