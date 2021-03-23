export function getBusinessHours(payload) {
  if (!payload.business_hours) {
    return "00:00 - 23:59";
  }
  const options = {
    timeZone: payload.timezone,
    weekday: "long",
  };

  const currentDay = new Date().toLocaleString("en-SG", options);
  const businessHours = payload.business_hours.find(
    (bHour) => bHour.day_name === currentDay
  );

  if (businessHours) {
    const { from, to } = businessHours;
    const opening = from.substr(0, from.lastIndexOf(":"));
    const closing = to.substr(0, to.lastIndexOf(":"));
    const businessHour = `${opening} - ${closing}`;
    const isClosed = businessHour === "00:00 - 00:00";

    return {
      opening,
      closing,
      businessHour,
      isClosed,
    };
  }

  return {
    businessHour: "",
    opening: "",
    closing: "",
    isClosed: false,
  };
}
