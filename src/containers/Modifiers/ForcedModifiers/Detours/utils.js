export function getForcedModifierDetours(detours, forcedModifierOptionId) {
  try {
    const detoursIds = JSON.parse(detours);

    if (detoursIds) {
      for (const fm in detoursIds) {
        for (const om in detoursIds[fm]) {
          if (om === forcedModifierOptionId) {
            return detoursIds[fm][om];
          }
        }
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

export function getTotalPrice(subTotal) {
  return Number(
    truncateDecimal(
      subTotal && subTotal.length
        ? subTotal.reduce((acc, item) => acc + item, 0)
        : 0
    )
  );
}

export function truncateDecimal(number) {
  return Number.isInteger(Number(number))
    ? Number(number)
    : Number(number).toFixed(2);
}
