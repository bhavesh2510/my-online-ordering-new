import React, { useState } from "react";
import { FormGroup, Input, Label } from "reactstrap";
import ModifierOption from "../../ModifierOption";
import { Radio } from "antd";

const ModifierCategory = ({
  forceModifier,
  detours,
  currency,
  getModifierPrice,
  onSelectionChange,
}) => {
  const [selectedModifierId, setSelectedModifierId] = useState();
  const handleGroupSelectionChange = ({ target: { value } }) => {
    const selectedForceModifier = forceModifier.items.find(
      ({ id }) => id === value
    );

    setSelectedModifierId(value);
    onSelectionChange({
      ...selectedForceModifier,
      optionalModifiers: [],
      categoryId: forceModifier.fm_cat_id,
      price: Number(selectedForceModifier.price),
    });
  };
  return (
    <div
      // key={fItem.id}
      style={{
        //   background: "red",
        display: "flex",
        justifyContent: "space-between",
        margin: "10px",
        height: "20px",
      }}
    >
      <Radio.Group onChange={handleGroupSelectionChange}>
        {forceModifier.items &&
          forceModifier.items.map((item, i) => (
            <ModifierOption
              key={i}
              isChecked={item.id === selectedModifierId}
              currency={currency}
              option={item}
              categoryId={forceModifier.fm_cat_id}
              forceModifierdetours={detours}
              getModifierPrice={getModifierPrice}
              onSelectionChange={onSelectionChange}
            />
          ))}
      </Radio.Group>
    </div>
  );
};

// const ModifierOptions = React.memo(({ item, optionId }) => {
//   // const detours = getForcedModifiersDetours(item, optionId)
//   return <></>;
// });

export default ModifierCategory;
