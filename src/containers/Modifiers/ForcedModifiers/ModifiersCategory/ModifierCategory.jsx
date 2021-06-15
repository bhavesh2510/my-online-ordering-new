import React, { useState } from "react";
import { Radio } from "antd";
import { ModifierOption } from "../../ModifierOption";
//import "./ModifierCategory.scss";
import "../../../Modals/PizzaModal/PizzaModal.css";

export const ModifierCategory = ({
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
    <>
      <div
        className="modifier-category"
        style={{
          backgroundColor: "#f1f1f1",
          marginBottom: "10px",
          paddingTop: "10px",
          paddingBottom: "20px",
        }}
      >
        <p
          className="modifier-category-name text-pizzamodal"
          style={{
            marginLeft: "15px",
            fontSize: "20px",
            color: "black",
          }}
        >
          {forceModifier.fm_cat_name}
        </p>
        <br />

        <p
          className="modifier-category-instruction text-pizzamodal"
          style={{
            marginLeft: "20px",
            fontSize: "13px",
            marginTop: "-15px",
            marginBottom: "20px",
          }}
        >
          You can choose only 1 option
        </p>

        <div
          className="modifier-options"
          style={{ marginTop: "10px", marginLeft: "20px" }}
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
      </div>
    </>
  );
};
export default ModifierCategory;
