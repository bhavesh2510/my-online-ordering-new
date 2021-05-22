export function getDetours(forcedModifers) {
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

  return JSON.stringify(detours);
}

export function getModifierIds(modifers) {
  return modifers ? modifers.map(({ id }) => id).join() : "";
}

export function isSameItem(item1, modifiers, item2) {
  const sameId = item1.id === item2.id;

  if (modifiers) {
    const itemFmId = getModifierIds(modifiers.forcedModifier) || item1.fmId;
    const itemOmId = getModifierIds(modifiers.optionalModifier) || item1.omId;
    const itemDetours = getDetours(modifiers.forcedModifier) || item1.detours;
    const isFmid = itemFmId && itemFmId.length !== 0;
    const isSpecialCases =
      item2.id === item1.id &&
      item2.omId === itemOmId &&
      item2.type === item1.type;

    return isFmid
      ? itemFmId === item2.fmId &&
          item2.detours === itemDetours &&
          isSpecialCases
      : isSpecialCases;
  } else if (item1.isPizza && item2.isPizza) {
    const isSameToppings = item1.toppingIdx1 === item2.toppingIdx1;
    const isSameBase = item1.baseId === item2.baseId;
    const isSameSize = item1.sizeId === item2.sizeId;

    return sameId && isSameBase && isSameToppings && isSameSize;
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
