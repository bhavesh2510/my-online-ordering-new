import React, { useState } from "react";
import { FormGroup, Input, Label } from "reactstrap";
import ModifierCategory from "./ModifiersCategory/ModifierCategory";

const ForcedModifiers = ({
  forcedModifiers,
  detours,
  currency,
  getModifierPrice,
  onSelectionChange,
}) => {
  const [selectedForceModifiers, setSelectedForceModifiers] = useState([]);

  const getTotalPrice = (updatedForcedModifiers) => {
    return updatedForcedModifiers.reduce(
      (acc, item) => acc + Number(item.price),
      0
    );
  };

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
    <div style={{ width: "100%" }}>
      {console.log("comp forcedModifier", forcedModifiers)}
      {forcedModifiers.map((item) => {
        if (item) {
          return (
            <>
              <h4>{item.fm_cat_name}</h4>
              <span>Please select only 1 of the following options</span>
              {forcedModifiers.map((forceModifier, i) => {
                return (
                  <ModifierCategory
                    key={i}
                    forceModifier={forceModifier}
                    detours={detours}
                    currency={currency}
                    getModifierPrice={getModifierPrice}
                    onSelectionChange={handleSelectionChange}
                  />
                );
              })}
            </>
          );
        }
      })}
    </div>
  );
};

export default ForcedModifiers;
