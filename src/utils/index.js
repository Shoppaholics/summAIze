export const capitaliseFirstLetter = (str) => {
  if (!str) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatEventDateTime = (event) => {
  switch (event.object) {
    case "datespan":
      return (
        new Date(event.startDate).toDateString() +
        " ~ " +
        new Date(event.endDate).toDateString()
      );
    case "timespan": {
      const endDate = new Date(event.endTime * 1000);
      const startDate = new Date(event.startTime * 1000);

      return (
        startDate.toDateString() +
        " " +
        startDate.toLocaleTimeString() +
        " ~ " +
        endDate.toDateString() +
        " " +
        endDate.toLocaleTimeString()
      );
    }
    default:
      return "Invalid date";
  }
};
