import React, { useState } from "react";
import ModifierCategory from "../ForcedModifiers/ModifiersCategory/ModifierCategory";

export const ForcedModifier = ({
  forcedModifiers,
  detours,
  currency,
  getModifierPrice,
  onSelectionChange,
}) => {
  const [selectedForceModifiers, setSelectedForceModifiers] = useState([]);

  function getTotalPrice(updatedForcedModifiers) {
    return updatedForcedModifiers.reduce(
      (acc, item) => acc + Number(item.price),
      0
    );
  }

  const handleSelectionChange = (forceModifier) => {
    let updatedModifiers = [];
    const isModifierExists = selectedForceModifiers.find(
      ({ id }) => id === forceModifier.id
    );
    const modiferWithSameCategoryIndex = selectedForceModifiers.findIndex(
      ({ categoryId }) => categoryId === forceModifier.categoryId
    );

    if (modiferWithSameCategoryIndex >= 0) {
      updatedModifiers = selectedForceModifiers.map((modifier) => {
        if (modifier.categoryId === forceModifier.categoryId) {
          return { ...forceModifier };
        }

        return modifier;
      });

      setSelectedForceModifiers(updatedModifiers);
    } else if (isModifierExists) {
      updatedModifiers = selectedForceModifiers.map((modifier) => {
        if (modifier.id === forceModifier.id) {
          return {
            ...modifier,
            ...forceModifier,
          };
        }

        return modifier;
      });

      setSelectedForceModifiers(updatedModifiers);
    } else {
      updatedModifiers = [...selectedForceModifiers, forceModifier];

      setSelectedForceModifiers(updatedModifiers);
    }
    onSelectionChange &&
      onSelectionChange(updatedModifiers, getTotalPrice(updatedModifiers));
  };

  return (
    forcedModifiers &&
    forcedModifiers.map((forceModifier, i) => (
      <ModifierCategory
        key={i}
        forceModifier={forceModifier}
        detours={detours}
        currency={currency}
        getModifierPrice={getModifierPrice}
        onSelectionChange={handleSelectionChange}
      />
    ))
  );
};
export default ForcedModifier;
