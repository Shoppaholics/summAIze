import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import { createEventForCalendars } from "../../services/calendarService";
import { capitaliseFirstLetter } from "../../utils";

const CreateEventMenu = ({ calendars }) => {
  const [selectedCalendars, setSelectedCalendars] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!calendars) {
      return;
    }

    let selected = [];
    calendars.map((provider) =>
      provider.calendars?.map((calendar) => selected.push(calendar))
    );
    setSelectedCalendars(selected);
  }, [calendars]);

  const isCalendarSelected = (calendarId) => {
    return selectedCalendars?.find((calendar) => calendar.id === calendarId);
  };

  const handleSubmit = async (e) => {
    const { status } = await createEventForCalendars(e, selectedCalendars);
    setStatus(status);
  };

  return (
    <div className="border-b-2 mt-3 mb-8 py-3">
      <p className="text-base font-bold">Add event to calendar</p>

      {/* Panel to select calendars to add event to */}
      <div className="flex flex-row space-x-5">
        {calendars?.map((provider) => (
          <div key={provider.email}>
            <p className="font-medium mb-1">
              {capitaliseFirstLetter(provider.provider)}
            </p>
            <div className="space-x-3">
              {provider.calendars?.map((calendar) => (
                <button
                  key={calendar.id}
                  className={`${isCalendarSelected(calendar.id) ? "bg-green-50" : "bg-gray-50"} text-gray-800 text-sm px-2 py-1 rounded-lg hover:bg-opacity-50`}
                  onClick={() => {
                    if (isCalendarSelected(calendar.id)) {
                      setSelectedCalendars(
                        selectedCalendars.filter(
                          (selectedCalendar) =>
                            calendar.id != selectedCalendar.id
                        )
                      );
                    } else {
                      setSelectedCalendars([...selectedCalendars, calendar]);
                    }
                  }}
                >
                  {calendar.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <form action={handleSubmit} className="flex flex-col space-y-2 mt-4">
        <div className="space-x-2">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter event title"
            required
          />
        </div>
        <div className="space-x-2">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="Enter event description"
          />
        </div>
        <div className="space-x-2">
          <label htmlFor="startDateTime">Start date & time:</label>
          <input
            type="datetime-local"
            id="startDateTime"
            name="startDateTime"
            placeholder="start time"
            required
          />
          <label htmlFor="endDateTime">End date & time:</label>
          <input
            type="datetime-local"
            id="endDateTime"
            name="endDateTime"
            placeholder="end time"
            required
          />
        </div>
        <div className="space-x-2">
          <label htmlFor="participants">Participants:</label>
          <input
            type="text"
            id="participants"
            name="participants"
            placeholder="Enter participants' email separated by a space"
            className="min-w-96"
          />
        </div>
        <button
          type="submit"
          className="self-start bg-blue-100 py-1 px-2 rounded-md"
        >
          Create event
        </button>
      </form>

      <p>{status}</p>
    </div>
  );
};

CreateEventMenu.propTypes = {
  calendars: PropTypes.object.isRequired,
};

export default CreateEventMenu;
