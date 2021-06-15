import React from "react";
import Detours from "../Modifiers/ForcedModifiers/Detours/Detours";
import { Radio } from "antd";
import { getForcedModifierDetours } from "../Modifiers/ForcedModifiers/Detours/utils";
//import "./ModifierOption.scss";

export const ModifierOption = ({
  option,
  currency,
  forceModifierdetours,
  categoryId,
  isChecked,
  getModifierPrice,
  onSelectionChange,
}) => {
  const detours = getForcedModifierDetours(forceModifierdetours, option.id);

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
  }

  return (
    <>
      <div style={{ display: "flex" }} className="modifier-options-container">
        {/* <section> */}
        {/* <label
          className="modifier-label"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        > */}
        <Radio value={option.id}>{option.name}</Radio>
        <div style={{ fontSize: "13px", marginLeft: "auto" }}>
          <b>{`${currency} ${getModifierPrice(option.price)}`}</b>
        </div>
      </div>
      {/* </label> */}
      {/* </section> */}
      {detours && isChecked ? (
        <Detours
          optionalModifierId={detours}
          getModifierPrice={getModifierPrice}
          onDetourSelectionChange={handleSelectionChange}
        />
      ) : null}
    </>
  );
};
export default ModifierOption;
