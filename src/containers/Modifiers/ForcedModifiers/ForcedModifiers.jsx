import React, { useEffect, useState } from "react"
import ModifierCategory from "../ForcedModifiers/ModifiersCategory/ModifierCategory"
import { getTaxes } from "../../../state-management/menu/operations"
import { truncateDecimal } from "../../../state-management/menu/utils"
import { useSelector } from "react-redux"

export const ForcedModifier = ({
  item,
  forcedModifiers,
  detours,
  currency,
  getModifierPrice,
  onSelectionChange,
  lowestPricearray
}) => {
  console.log("fm ion fm", lowestPricearray)
  const [selectedForceModifiers, setSelectedForceModifiers] = useState([
    ...lowestPricearray
  ])
  const menu = useSelector((state) => state.menu)

  function getTotalPrice(updatedForcedModifiers) {
    return updatedForcedModifiers.reduce(
      (acc, item) => acc + Number(item.price),
      0
    )
  }

  const handleSelectionChange = (forceModifier) => {
    console.log("checking fm req", lowestPricearray, forceModifier)
    let updatedModifiers = [...lowestPricearray]
    lowestPricearray.map((item, index) => {
      if (item.fm_cat_id === forceModifier.fm_cat_id) {
        console.log("index in fm is", index, lowestPricearray)
        updatedModifiers.splice(index, 1)
        updatedModifiers.push(forceModifier)
      }
    })
    console.log("selected fm", updatedModifiers)
    // const isModifierExists = selectedForceModifiers.find(
    //   ({ id }) => id === forceModifier.id
    // )
    // const isModifierDuplicateExists = selectedForceModifiers.find(
    //   ({ fm_cat_id }) => fm_cat_id === forceModifier.fm_cat_id
    // )
    // const modiferWithSameCategoryIndex = selectedForceModifiers.findIndex(
    //   ({ categoryId }) => categoryId === forceModifier.categoryId
    // )

    // // console.log("checking mf", isModifierDuplicateExists)

    // if (modiferWithSameCategoryIndex >= 0) {
    //   console.log("updated mf", selectedForceModifiers)
    //   updatedModifiers = selectedForceModifiers.map((modifier) => {
    //     if (modifier.categoryId === forceModifier.categoryId) {
    //       return { ...forceModifier }
    //     }

    //     return modifier
    //   })

    //   setSelectedForceModifiers(updatedModifiers)
    // } else if (isModifierExists) {
    //   updatedModifiers = selectedForceModifiers.map((modifier) => {
    //     if (modifier.id === forceModifier.id) {
    //       return {
    //         ...modifier,
    //         ...forceModifier
    //       }
    //     }

    //     return modifier
    //   })

    //   setSelectedForceModifiers(updatedModifiers)
    // } else {
    //   updatedModifiers = [...selectedForceModifiers, forceModifier]

    //   setSelectedForceModifiers(updatedModifiers)
    // }
    console.log("updated mf", updatedModifiers)
    onSelectionChange &&
      onSelectionChange(updatedModifiers, getTotalPrice(updatedModifiers))
  }

  const isPriceWithoutTax = () => {
    console.log(
      "price without tax",
      menu.restaurantInfo["price_without_tax_flag"]
    )
    return Number(menu.restaurantInfo["price_without_tax_flag"])
  }

  useEffect(() => {
    console.log("fm in fm", selectedForceModifiers)
  }, [selectedForceModifiers])

  return (
    forcedModifiers &&
    forcedModifiers.map((forceModifier, i) => {
      var priceArr = ""
      var temp = []

      let min = Math.min.apply(
        null,
        forceModifier?.items.map(function (item) {
          return item.price
        })
      )

      forceModifier.items.map((curr) => {
        if (min == curr.price) {
          priceArr = curr.id
          temp.push(curr)
        }
      })

      // setLowerIds(...priceA)
      console.log("low price in fm comp", priceArr, temp)
      return (
        <>
          <ModifierCategory
            key={i}
            forceModifier={forceModifier}
            detours={detours}
            currency={currency}
            getModifierPrice={getModifierPrice}
            onSelectionChange={handleSelectionChange}
            full_item={item}
            lowestModifierId={priceArr}
          />
        </>
      )
    })
  )
}
export default ForcedModifier
