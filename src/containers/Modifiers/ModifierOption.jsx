import React, { useEffect, useState } from "react"
import Detours from "../Modifiers/ForcedModifiers/Detours/Detours"
import { Radio, Form } from "antd"
import { getForcedModifierDetours } from "../Modifiers/ForcedModifiers/Detours/utils"
import { useSelector } from "react-redux"
//import "./ModifierOption.scss";

export const ModifierOption = ({
  item,
  option,
  currency,
  forceModifierdetours,
  categoryId,
  isChecked,
  getModifierPrice,
  onSelectionChange,
  lowestModifierId

  // checkedId
}) => {
  const detours = getForcedModifierDetours(forceModifierdetours, option.id)
  console.log("items in modify options", item)
  const [id, setid] = useState("17282")
  const menu = useSelector((state) => state.menu)

  useEffect(() => {
    var priceArr = []
    const itemForcedModifiers = item.forced_modifier.split(",")
    console.log("split fm", itemForcedModifiers)
    itemForcedModifiers.map((curritem) => {
      const filteredModifier = menu.allForcedModifier.filter((itemOfFilter) =>
        curritem.includes(itemOfFilter.fm_cat_id)
      )

      // let arr = filteredModifier[0]?.items

      let min = Math.min.apply(
        null,
        filteredModifier[0]?.items.map(function (item) {
          return item.id
        })
      )

      priceArr.push(min)
    })

    // priceArr.map((val) => {
    //   setid({ ...id, val })
    // })

    console.log("id of lower price", priceArr)
  }, [])

  function handleSelectionChange(selectedDetours) {
    const detourIds = selectedDetours.map((detour) => detour.id).join()
    const selectedForceModifier = {
      ...option,
      categoryId,
      optionalModifiers: selectedDetours,
      detour: detourIds,
      price:
        selectedDetours.reduce(
          (acc, item) => acc + (item.isFree ? 0 : Number(item.price)),
          0
        ) + Number(option.price)
    }

    onSelectionChange && onSelectionChange(selectedForceModifier)
  }

  useEffect(() => {
    console.log("checked id is", id)
  }, [id])
  return (
    <>
      <div style={{ display: "flex" }} className='modifier-options-container'>
        {/* <section> */}
        {/* <label
          className="modifier-label"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        > */}
        {/* <Form onFinish={(val) => console.log("val", val)}>
          <Form.Item name='radio'> */}
        {/* <Radio.Group value={lowestModifierId}> */}
        <Radio
          // key={option.id}
          value={option.id}
          // checked={option.id === "17282" ? "true" : "false"}
        >
          {option.name}
        </Radio>
        {/* </Radio.Group> */}

        {/* </Form.Item>
        </Form> */}

        <div style={{ fontSize: "13px", marginLeft: "auto" }}>
          <p>( {`${currency} ${getModifierPrice(option.price)}`} )</p>
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
  )
}
export default ModifierOption
