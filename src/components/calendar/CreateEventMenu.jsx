import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import descriptionIcon from "../../assets/icons/description.svg";
import participantsIcon from "../../assets/icons/participants.svg";
import timeIcon from "../../assets/icons/time.svg";
import titleIcon from "../../assets/icons/title.svg";
import {
  checkCalendarAvailability,
  createEventForCalendars,
} from "../../services/calendarService";
import { capitaliseFirstLetter } from "../../utils";

const CreateEventMenu = ({ calendars }) => {
  const [selectedCalendars, setSelectedCalendars] = useState(null);
  const [status, setStatus] = useState(null);

  const [participants, setParticipants] = useState("");
  const [availabilities, setAvailabiliies] = useState(null);
  const [showCheckAvailabilitiesMenu, setShowCheckAvailabilitiesMenu] =
    useState(false);

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

  const handleCheckAvailability = async (e) => {
    const { status, availabilities } = await checkCalendarAvailability(
      e,
      participants
    );
    setStatus(status);
    setAvailabiliies(availabilities);
  };

  return (
    <div className="py-3">
      {/* Panel to select calendars to add event to */}
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
            Start
          </p>
          <input
            type="datetime-local"
            name="startDateTime"
            placeholder="start time"
            required
          />
          <p className="bg-gray-100 p-1 px-2 rounded-md ml-6 mr-2 text-sm">
            End
          </p>
          <input
            type="datetime-local"
            name="endDateTime"
            placeholder="end time"
            required
          />
        </div>

        <div className="space-x-3 flex flex-row">
          <img src={participantsIcon} width={24} height={24} />
          <input
            type="text"
            id="participants"
            name="participants"
            placeholder="Enter participants' email separated by a space"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            className="min-w-96 p-1"
          />
          <button
            onClick={() =>
              setShowCheckAvailabilitiesMenu(!showCheckAvailabilitiesMenu)
            }
            type="button"
            className="p-1 px-2 bg-blue-100 rounded-full text-sm hover:bg-opacity-40"
          >
            Check availability
          </button>
        </div>
        <button
          type="submit"
          className="self-end bg-blue-500 py-1 px-2 rounded-md text-white font-medium hover:bg-opacity-50"
        >
          create
        </button>
      </form>

      {showCheckAvailabilitiesMenu && (
        <form
          action={handleCheckAvailability}
          className="flex flex-row items-center relative bottom-10 left-3"
        >
          <p className="bg-gray-100 p-1 px-2 rounded-md ml-4 mr-2 text-sm">
            Start
          </p>
          <input
            type="datetime-local"
            name="startDateTime"
            placeholder="start time"
            required
          />
          <p className="bg-gray-100 p-1 px-2 rounded-md ml-6 mr-2 text-sm">
            End
          </p>
          <input
            type="datetime-local"
            name="endDateTime"
            placeholder="end time"
            required
          />

          <input
            type="number"
            name="duration"
            placeholder="Duration"
            required
            className="ml-3 w-20"
          />
          <button
            type="submit"
            className="bg-green-600 text-white text-sm font-medium px-2 py-1 rounded-lg ml-5 hover:bg-opacity-50"
          >
            Check
          </button>
        </form>
      )}

      {availabilities && (
        <div className="space-x-2">
          {availabilities.length > 0 ? (
            availabilities.map((availability, index) => (
              <span key={index} className="bg-gray-100 p-1">
                {new Date(availability.startTime * 1000).toLocaleString()}
              </span>
            ))
          ) : (
            <p>No timeslots where all participants are available</p>
          )}
        </div>
      )}

      <p>{status}</p>
    </div>
  );
};

CreateEventMenu.propTypes = {
  calendars: PropTypes.object.isRequired,
};

export default CreateEventMenu;
