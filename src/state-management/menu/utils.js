export function getDetours(forcedModifers) {
  console.log("modifiers in utils", forcedModifers);
  const detours = forcedModifers
    ? forcedModifers.reduce((acc, fm) => {
        const detour = fm.detour ? { [fm.id]: fm.detour } : [];

        return detour.length
          ? {
              ...acc,
              ...detour,
            }
          : acc;
      }, {})
    : "";
  console.log("detours in utils", detours);
  return JSON.stringify(detours);
}

export function getModifierIds(modifers) {
  console.log("id of modifiers", modifers);
  return modifers ? modifers.map(({ id }) => id).join() : "";
}

export function getDetoursIds(modifers) {
  var temparr = [];
  var array_id = [];
  modifers.map((currval, i) => {
    temparr.push(currval.optionalModifiers);
  });

  console.log("temp arr is", temparr);
  console.log("temp arr length", temparr.length);

  for (let i = 0; i < temparr.length; i++) {
    console.log("temp", temparr[i]);
    var temp = [];
    temp.push(temparr[i]);
    console.log("temp is", temp);
    console.log("temp length", temp[0].length);
    for (let j = 0; j < temp[0].length; j++) {
      console.log("value", temparr[i][j].id);
      array_id.push(temparr[i][j].id);
    }
  }

  var string = array_id.toString();
  return string;
}

export function isSameItem(item1, modifiers, item2) {
  console.log("item1", item1);
  console.log("item2", item2);
  //console.log("item2", item2.modifiers.forcedModifier[0].optionalModifiers[0]);

  // console.log("detour_val", detour_val);
  const sameId = item1.id === item2.id;
  console.log("same id", sameId);

  if (modifiers) {
    var current_string;
    if (item2.fmId == "") {
      var current_string = null;
    } else {
      var temparr = [];
      var array_id = [];
      item2.modifiers.forcedModifier.map((currval, i) => {
        temparr.push(currval.optionalModifiers);
      });

      console.log("temp arr is", temparr);
      console.log("temp arr length", temparr.length);

      for (let i = 0; i < temparr.length; i++) {
        console.log("temp", temparr[i]);
        var temp = [];
        temp.push(temparr[i]);
        console.log("temp is", temp);
        console.log("temp length", temp[0].length);
        for (let j = 0; j < temp[0].length; j++) {
          console.log("value", temparr[i][j].id);
          array_id.push(temparr[i][j].id);
        }
      }

      current_string = array_id.toString();
    }
    console.log("current_string is", current_string);

    //temp.push(item2.modifiers.forcedModifers);
    const itemFmId = getModifierIds(modifiers.forcedModifier) || item1.fmId;
    const itemOmId = getModifierIds(modifiers.optionalModifier) || item1.omId;
    const itemDetours = getDetours(modifiers.forcedModifier) || item1.detours;
    const detourid = getDetoursIds(modifiers.forcedModifier) || item1.detours;
    console.log("id of modifiers", itemFmId);
    console.log("id of detours", JSON.stringify(detourid));

    // console.log("detour_val current", detourid);

    const isFmid = itemFmId && itemFmId.length !== 0;
    console.log("isFmId", itemFmId);
    console.log("isFmId", item2.fmId);
    const isDetourId = detourid && detourid.length !== 0;
    console.log("isDetourId", detourid.length);

    if (detourid.length > 2) {
      const isSpecialCases =
        item2.id === item1.id &&
        item2.omId === itemOmId &&
        current_string === detourid &&
        item2.type === item1.type;
      console.log("spcial cases", isSpecialCases);

      return isFmid
        ? itemFmId === item2.fmId &&
            item2.detours === itemDetours &&
            //current_string === detourid &&
            isSpecialCases
        : isSpecialCases;
    } else if (detourid.length == 2 && item2.fmId == itemFmId) {
      const isSpecialCases =
        item2.id === item1.id &&
        item2.omId === itemOmId &&
        //current_string === detourid &&
        item2.type === item1.type;
      console.log("spcial cases", isSpecialCases);

      return isFmid
        ? itemFmId === item2.fmId &&
            item2.detours === itemDetours &&
            //current_string === detourid &&
            isSpecialCases
        : isSpecialCases;
    } else {
      const isSpecialCases =
        item2.id === item1.id &&
        item2.omId === itemOmId &&
        //current_string === detourid &&
        item2.type === item1.type;
      console.log("spcial cases", isSpecialCases);

      return isFmid
        ? itemFmId === item2.fmId &&
            item2.detours === itemDetours &&
            //current_string === detourid &&
            isSpecialCases
        : isSpecialCases;
    }
  } else if (item1.isPizza && item2.isPizza) {
    const firsthalf = item1.first_half_toppings === item2.first_half_toppings;
    const secondhalf =
      item1.second_half_toppings === item2.second_half_toppings;
    const isSameToppings = item1.toppingIdx1 === item2.toppingIdx1;
    const isSameBase = item1.baseId === item2.baseId;
    const isSameSize = item1.sizeId === item2.sizeId;

    return (
      sameId &&
      isSameBase &&
      firsthalf &&
      secondhalf &&
      isSameToppings &&
      isSameSize
    );
  }

  return sameId;
}

export function isHappyHourStillActive(item, timezone) {
  if (!item.isHappyHourActive) {
    return {
      isActive: false,
      distance: 0,
    };
  }
  const options = {
    timeZone: timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };

  const getRestaurantTimeNDay = new Date().toLocaleString("en-SG", options);

  const countDownDate = new Date(item.happyHourDetail.countDownDate).getTime();
  const nowTime = new Date(getRestaurantTimeNDay).getTime();

  const distance = countDownDate - nowTime;

  if (distance > 60000) {
    return {
      isActive: true,
      distance,
    };
  }

  return false;
}

export function truncateDecimal(number) {
  return Number.isInteger(Number(number))
    ? Number(number).toFixed(2)
    : Number(number).toFixed(2);
}

export function setTimer(calDistance, timeOutRef) {
  let distance = calDistance;

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  setTimeout(() => {
    if (
      timeOutRef &&
      timeOutRef.current !== undefined &&
      timeOutRef.current !== null
    ) {
      timeOutRef.current.innerText = `${hours}h ${minutes}m`;
    }
  }, 0);

  const x = setInterval(function () {
    // Find the distance between now and the count down date
    distance -= 60000;
    // Time calculations for days, hours, minutes and seconds
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    //const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance <= 0) {
      timeOutRef.current.innerText = "HappyHour Expired";
      clearInterval(x);
    }

    if (
      timeOutRef &&
      (timeOutRef.current === undefined || timeOutRef.current === null)
    ) {
      clearInterval(x);
    } else if (timeOutRef) {
      timeOutRef.current.innerText = `${hours}h ${minutes}m`;
    }
  }, 60000);
}
