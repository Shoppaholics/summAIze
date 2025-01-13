import React, { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { fetchCalendars } from "../services/calendarService";

const TaskPage = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const [calendars, setCalendars] = useState(null);

  const handleFetchCalendars = async () => {
    const { fetchedCalendars } = await fetchCalendars(userId);
    setCalendars(fetchedCalendars);
    console.log("Calen", calendars);
  };

  return (
    <div>
      <button onClick={handleFetchCalendars}>Fetch calendar</button>
      <div>
        {calendars?.map((provider, index) => (
          <div key={index}>
            <h3>{provider.email}</h3>
            <div>
              {provider.calendars?.data?.map((calendar, index) => (
                <div key={index}>
                  <h5>{calendar.name}</h5>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskPage;
