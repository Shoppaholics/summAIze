import React, { useState } from "react";

import EventCard from "../components/calendar/EventCard";
import { useAuth } from "../context/AuthContext";
import { fetchCalendarsWithEvents } from "../services/calendarService";

const Calendar = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const [calendars, setCalendars] = useState(null);

  const handleFetchCalendars = async () => {
    const { fetchedCalendars } = await fetchCalendarsWithEvents(userId);
    console.log(fetchedCalendars);
    setCalendars(fetchedCalendars);
  };

  return (
    <div>
      <button onClick={handleFetchCalendars}>Fetch calendar</button>
      <div>
        {calendars?.map((provider, index) => (
          <div key={index}>
            <h3>Provider/Email: {provider.email}</h3>
            <div>
              {provider.calendars?.map((calendar, index) => (
                <div key={index}>
                  <h5>Calendar name: {calendar.name}</h5>
                  {calendar.events.map((event, index) => (
                    <EventCard key={index} title={event.title} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
