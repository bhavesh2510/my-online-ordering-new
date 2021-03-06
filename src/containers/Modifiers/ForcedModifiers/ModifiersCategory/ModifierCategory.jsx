import React, { useState } from "react"
import { Radio } from "antd"
import { ModifierOption } from "../../ModifierOption"
import "./ModifierCategory.css"
import "../../../Modals/PizzaModal/PizzaModal.css"

export const ModifierCategory = ({
  full_item,
  forceModifier,
  detours,
  currency,
  getModifierPrice,
  onSelectionChange,
  lowestModifierId
}) => {
  const [selectedModifierId, setSelectedModifierId] = useState(lowestModifierId)
  const handleGroupSelectionChange = ({ target: { value } }) => {
    const selectedForceModifier = forceModifier.items.find(
      ({ id }) => id === value
    )

    setSelectedModifierId(value)
    onSelectionChange({
      ...selectedForceModifier,
      optionalModifiers: [],
      categoryId: forceModifier.fm_cat_id,
      price: Number(selectedForceModifier.price)
    })
  }

  return (
    <>
      <div
        className='modifier-category'
        style={{
          // backgroundColor: "#f1f1f1",
          marginBottom: "10px",
          paddingTop: "10px",
          paddingBottom: "20px"
        }}
      >
        <p
          className='modifier-category-name '
          style={{
            marginLeft: "15px",
            fontSize: "20px",
            fontWeight: "700",
            color: "#5c48d2"
          }}
        >
          {forceModifier.fm_cat_name}
        </p>
        <br />

        <p
          className='modifier-category-instruction '
          style={{
            marginLeft: "15px",
            fontSize: "15px",
            marginTop: "-35px",
            marginBottom: "20px",
            color: "#968EA1"
          }}
        >
          You can choose only 1 option
        </p>

        <div
          className='modifier-options'
          style={{ marginTop: "10px", marginLeft: "20px" }}
        >
          <Radio.Group
            onChange={handleGroupSelectionChange}
            value={selectedModifierId}
          >
            {forceModifier.items &&
              forceModifier.items.map((item, i) => {
                return (
                  <>
                    <ModifierOption
                      key={i}
                      isChecked={item.id === selectedModifierId}
                      currency={currency}
                      option={item}
                      categoryId={forceModifier.fm_cat_id}
                      forceModifierdetours={detours}
                      getModifierPrice={getModifierPrice}
                      onSelectionChange={onSelectionChange}
                      item={full_item}
                      lowestModifierId={lowestModifierId}
                      // checkedId={min}
                    />
                  </>
                )
              })}
          </Radio.Group>
        </div>
      </div>
    </>
  )
}
export default ModifierCategory
