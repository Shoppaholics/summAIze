import React, { useEffect, useState } from "react";

import CalendarCard from "../components/calendar/CalendarCard";
import CreateEventMenu from "../components/calendar/CreateEventMenu";
import { useAuth } from "../context/AuthContext";
import { fetchCalendarsWithEvents } from "../services/calendarService";
import { capitaliseFirstLetter } from "../utils";

const Calendar = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const [calendars, setCalendars] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleFetchCalendars();
  }, [session]);

  const handleFetchCalendars = async () => {
    if (!userId) return;
    setLoading(true);
    const { fetchedCalendars } = await fetchCalendarsWithEvents(userId);
    console.log("Fetched calendar:", fetchedCalendars);
    setCalendars(fetchedCalendars);
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-5 bg-white">
      <p className="font-bold text-3xl">Calendar</p>
      {loading ? (
        <p>Loading calendars...</p>
      ) : (
        <>
          <CreateEventMenu
            calendars={calendars?.map((provider) => ({
              email: provider.email,
              provider: provider.provider,
              calendars: provider.calendars
                ?.filter((calendar) => !calendar.readOnly)
                .map((calendar) => ({
                  name: calendar.name,
                  id: calendar.id,
                  grantId: calendar.grantId,
                })),
            }))}
          />

          <button
            onClick={handleFetchCalendars}
            className="bg-gray-100 p-2 rounded-lg"
          >
            Fetch calendars
          </button>

          <div className="mt-5 space-y-5">
            {calendars?.map((provider, index) => (
              <div key={index} className="space-y-3 border-b-4">
                <div className="flex flex-row space-x-3 items-center mb-3">
                  <p className="text-xl ">
                    {capitaliseFirstLetter(provider.provider)}
                  </p>
                  <p className="text-neutral-600">{provider.email}</p>
                </div>
                {provider?.calendars?.map((calendar) => (
                  <CalendarCard key={calendar.id} calendar={calendar} />
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Calendar;
