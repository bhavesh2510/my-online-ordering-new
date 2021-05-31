import React from "react";
//import Detours from "../Detours";
import { Radio } from "antd";
//import { getForcedModifierDetours } from "../../../../../utils";

export const ModifierOption = React.memo(
  ({
    option,
    currency,
    forceModifierdetours,
    categoryId,
    isChecked,
    getModifierPrice,
    onSelectionChange,
  }) => {
    //const detours = getForcedModifierDetours(forceModifierdetours, option.id);

    function handleSelectionChange(selectedDetours) {
      const detourIds = selectedDetours.map((detour) => detour.id).join();
      const selectedForceModifier = {
        ...option,
        categoryId,
        optionalModifiers: selectedDetours,
        detour: detourIds,
        price:
          selectedDetours.reduce(
            (acc, item) => acc + (item.isFree ? 0 : Number(item.price)),
            0
          ) + Number(option.price),
      };

      onSelectionChange && onSelectionChange(selectedForceModifier);
      console.log("price", getModifierPrice);
    }

    return (
      <div className="modifier-options-container">
        <section>
          <label className="modifier-label">
            <Radio value={option.id}>{option.name}</Radio>
          </label>
          {/* <span className="modifier-amount">{`${currency} ${getModifierPrice}`}</span> */}
        </section>
        {/* {detours && isChecked ? (
          <Detours
            optionalModifierId={detours}
            getModifierPrice={getModifierPrice}
            onDetourSelectionChange={handleSelectionChange}
          />
        ) : null} */}
      </div>
    );
  }
);

export default ModifierOption;
