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

  console.log("what is bhour", businessHours);
  if (businessHours) {
    const { from, to } = businessHours;
    const opening = from.substr(0, from.lastIndexOf(":"));
    const closing = to.substr(0, to.lastIndexOf(":"));
    const businessHour = `${opening} - ${closing}`;
    const isClosed = businessHour === "00:00 - 00:00";

    console.log("isClosed in operation", isClosed);

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

export function getClosedForWeekday(payload, timezone) {
  var moment = require("moment-timezone");
  const options = {
    timeZone: timezone,
    weekday: "long",
  };

  var x = moment.tz(moment(), `${timezone}`).format("HH:mm");
  var current_time = x.substr(0, x.lastIndexOf(":"));
  const current_day = new Date().toLocaleString("en-SG", options);
  const daytime = [];

  payload.map((val) => {
    if (val.type == "DAYTIME") {
      daytime.push(val);
    }
  });

  for (let val of daytime) {
    const options = {
      timeZone: timezone,
      weekday: "long",
    };

    const current_day = new Date().toLocaleString("en-SG", options);
    const weekDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    var moment = require("moment-timezone");

    var x = moment.tz(moment(), `${timezone}`).format("HH:mm");
    var current_time = x.substr(0, x.lastIndexOf(":"));

    var y = val.time_from;
    var a = y.substr(0, y.lastIndexOf(":"));
    var z = val.time_to;
    var b = z.substr(0, z.lastIndexOf(":"));

    var from = a.substr(0, a.lastIndexOf(":"));
    var to = b.substr(0, b.lastIndexOf(":"));

    console.log("today is", current_time);
    console.log("today is", from);
    console.log("today is", to);
    console.log("today is", current_day);

    if (
      current_day === weekDays[val.week_day] &&
      current_time >= from &&
      current_time <= to
    ) {
      return {
        isClosedForWeekday: true,
        messageForWeekday: `we are closed on every ${
          weekDays[val.week_day]
        } between ${from > 12 ? `${from - 12} PM` : `${from} AM`} to ${
          to > 12 ? `${to - 12} PM` : `${to} AM`
        }`,
      };
    }
  }
}

export function getClosedForMonth(payload, timezone) {
  var moment = require("moment-timezone");
  const options = {
    timeZone: timezone,
    weekday: "long",
  };

  var x = moment.tz(moment(), `${timezone}`).format("HH:mm");
  var current_time = x.substr(0, x.lastIndexOf(":"));
  const current_day = new Date().toLocaleString("en-SG", options);
  const datetime = [];

  payload.map((val) => {
    if (val.type == "DATETIME") {
      datetime.push(val);
    }
  });

  for (let val of datetime) {
    var date_obj = new Date().toISOString().slice(0, 10);
    var off = val.close_date;
    var y = val.time_from;
    var a = y.substr(0, y.lastIndexOf(":"));
    var z = val.time_to;
    var b = z.substr(0, z.lastIndexOf(":"));

    var from = a.substr(0, a.lastIndexOf(":"));
    var to = b.substr(0, b.lastIndexOf(":"));
    var date_off = off.slice(8);
    var dateObj = date_obj.slice(8);

    console.log("Date time api", date_off);

    console.log("Date time current", dateObj);
    if (date_off == dateObj && current_time >= from && current_time <= to) {
      return {
        isClosedForMonth: true,
        messageForMonth: `we are closed on ${date_off}th of every month between ${
          from > 12 ? `${from - 12} PM` : `${from} AM`
        } to ${to > 12 ? `${to - 12} PM` : `${to} AM`}`,
      };
    }
  }
}

export function getClosedForOnceAMonth(payload, timezone) {
  var moment = require("moment-timezone");
  const options = {
    timeZone: timezone,
    weekday: "long",
  };

  var x = moment.tz(moment(), `${timezone}`).format("HH:mm");
  var current_time = x.substr(0, x.lastIndexOf(":"));
  const current_day = new Date().toLocaleString("en-SG", options);
  const once = [];

  payload.map((val) => {
    if (val.type == "ONCE") {
      once.push(val);
    }
  });

  for (let val of once) {
    var date_off = val.close_date;
    var dateObj = new Date().toISOString().slice(0, 10);
    var y = val.time_from;
    var a = y.substr(0, y.lastIndexOf(":"));
    var z = val.time_to;
    var b = z.substr(0, z.lastIndexOf(":"));

    var from = a.substr(0, a.lastIndexOf(":"));
    var to = b.substr(0, b.lastIndexOf(":"));

    console.log("Date time api", date_off);

    console.log("Date time current", dateObj);
    if (date_off == dateObj && current_time >= from && current_time <= to) {
      return {
        isClosedForOnceAMonth: true,
        messageForOnceAMonth: `we are closed on ${date_off} between ${
          from > 12 ? `${from - 12} PM` : `${from} AM`
        } to ${to > 12 ? `${to - 12} PM` : `${to} AM`}`,
      };
    }
  }
}
