import PropTypes from "prop-types";
import React from "react";

import { formatEventDateTime } from "../../utils";

const EventCard = ({ event }) => {
  console.log("Event", event);
  console.log(new Date(event.when.endTime * 1000));
  return (
    <div className="p-3 border rounded-lg">
      <div className="space-y-0.5">
        <p className="font-medium">{event.title}</p>

        <p className="text-sm text-gray-600">
          {formatEventDateTime(event.when)}
        </p>

        <p>Description: {event.textDescription || "none"}</p>

        <p>Organiser: {event.organizer.name || "none"}</p>

        <div className="space-x-2">
          <span>Participants:</span>
          {event.participants.length ? (
            event.participants.map((participant, index) => (
              <span key={index} className="text-sm">
                {participant.email}
              </span>
            ))
          ) : (
            <span>none</span>
          )}
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.object.isRequired,
};

export default EventCard;
