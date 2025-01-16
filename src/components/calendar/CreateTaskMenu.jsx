import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import descriptionIcon from "../../assets/icons/description.svg";
import timeIcon from "../../assets/icons/time.svg";
import titleIcon from "../../assets/icons/title.svg";
import { createTaskForCalendars } from "../../services/calendarService";
import { capitaliseFirstLetter } from "../../utils";

const CreateTaskMenu = ({ calendars }) => {
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
    const { status } = await createTaskForCalendars(e, selectedCalendars);
    setStatus(status);
  };

  return (
    <div className="py-3">
      {/* Panel to select calendars to add task to */}
      <div className="flex flex-row space-x-5 px-2 mb-3">
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

      <form action={handleSubmit} className="flex flex-col space-y-4 p-2">
        <div className="space-x-3 flex flex-row items-center">
          <img src={titleIcon} width={24} height={24} />
          <input
            type="text"
            name="title"
            placeholder="Enter event title"
            required
            className="p-1"
          />
        </div>
        <div className="space-x-3 flex flex-row items-center">
          <img src={descriptionIcon} width={24} height={24} />
          <input
            type="text"
            name="description"
            placeholder="Enter event description"
            className="p-1"
          />
        </div>

        <div className="flex flex-row items-center">
          <img src={timeIcon} width={24} height={24} />
          <p className="bg-gray-100 p-1 px-2 rounded-md ml-4 mr-2 text-sm">
            Time
          </p>
          <input
            type="datetime-local"
            name="startDateTime"
            placeholder="start time"
            required
          />
        </div>

        <button
          type="submit"
          className="self-end bg-blue-500 py-1 px-2 rounded-md text-white font-medium hover:bg-opacity-50"
        >
          Add
        </button>
      </form>

      <p>{status}</p>
    </div>
  );
};

CreateTaskMenu.propTypes = {
  calendars: PropTypes.object.isRequired,
};

export default CreateTaskMenu;
