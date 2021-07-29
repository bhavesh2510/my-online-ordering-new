import React, { useState } from "react";
import { Checkbox } from "antd";
import { defaultMemoize } from "reselect";
import "./OptionalModifiers.css";
import "../../Modals/PizzaModal/PizzaModal.css";

export const OptionalModifier = ({
  optionalModifier,
  currency,
  getModifierPrice,
  onSelectionChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  function getTotalPrice(updatedItems) {
    return updatedItems.reduce(
      (acc, item) => acc + (item.isFree ? 0 : Number(item.price)),
      0
    );
  }

  function isMaxLimit(selectedModifiers, catDetails) {
    if (Number(catDetails.maxLimit) === 0) {
      return false;
    }

    let counter = 0;

    for (let i = 0; i < selectedModifiers.length; i++) {
      if (selectedModifiers[i].omCatId === catDetails.omCatId) {
        counter++;
      }
    }
    if (counter >= catDetails.maxLimit) {
      return true;
    }

    return false;
  }

  function setFreeLimitPrices(allItems) {
    // update free limit items prices
    let sortedFilterItems = [];

    const priceSortedItems = allItems.sort((a, b) => a.price - b.price);

    optionalModifier &&
      optionalModifier.map((op) => {
        const freeLimit = Number(op.free_limit);
        const items = priceSortedItems.filter(
          (i) => i.omCatId === op.om_cat_id
        );

        const limit = freeLimit > items.length ? items.length : freeLimit;

        for (let i = 0; i < limit; i++) {
          items[i].isFree = true;
        }
        for (let i = limit; i < items.length; i++) {
          items[i].isFree = false;
        }
        sortedFilterItems = [...sortedFilterItems, ...items];
      });

    return sortedFilterItems;
  }

  const handleChange = (checked, modifier) => {
    let updatedItems = [];

    let withFreeLimitItems = [];

    if (checked) {
      updatedItems = [...selectedOptions, modifier];
    } else {
      updatedItems = selectedOptions.filter(({ id }) => id !== modifier.id);
    }
    withFreeLimitItems = setFreeLimitPrices(updatedItems);
    setSelectedOptions(withFreeLimitItems);

    // check if max limit has crossed for optional category items
    isMaxLimit(withFreeLimitItems, modifier);
    onSelectionChange(withFreeLimitItems, getTotalPrice(withFreeLimitItems));
  };

  return (
    optionalModifier &&
    optionalModifier.map((op, i) => (
      <div
        className="optional-modifiers-category"
        key={i}
        style={{ paddingTop: "5px" }}
      >
        <p
          className="modifier-category-name "
          style={{
            fontSize: "20px",
            fontWeight: "700",
            marginLeft: "20px",
            marginTop: "5px",
            color: "#5c48d2",
          }}
        >
          {op.om_cat_name}
        </p>

        <p
          className="modifier-category-instruction"
          style={{
            marginLeft: "20px",
            fontSize: "15px",
            marginTop: "-10px",
            color: "#968EA1",
          }}
        >
          {op.free_limit > 0
            ? `Cheapest ${op.free_limit} options will be free`
            : null}
          {op.free_limit > 0 && op.max_limit > 0 ? ", " : null}
          {op.max_limit > 0
            ? `You can choose max upto ${op.max_limit} options`
            : null}
        </p>
        <OptionalModifierOptions
          currency={currency}
          getModifierPrice={getModifierPrice}
          isMaxLimitReached={isMaxLimit}
          selectedOptions={selectedOptions}
          cat={op}
          onChange={handleChange}
        />
        <br />
      </div>
    ))
  );
};

const OptionalModifierOptions = (props) => {
  const catDetails = {
    omCatId: props.cat.om_cat_id,
    maxLimit: props.cat.max_limit,
  };

  const isMaxLimitReached = props.isMaxLimitReached(
    props.selectedOptions,
    catDetails
  );

  return (
    <div className="modifier-options">
      {props.cat.items.map((op, i) => {
        const canSetDisabled =
          isMaxLimitReached &&
          !props.selectedOptions.some(
            ({ id, omCatId }) => id === op.id && omCatId === op.omCatId
          );
        const currentItem = props.selectedOptions.find(
          (item) => item.id === op.id
        );

        const strikeOutFree =
          currentItem && currentItem.isFree ? "free-amount" : "";

        return (
          <section
            key={i}
            style={{
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            {/* <label
              className="modfier-label"
              style=
              {{ marginLeft: "20px", marginTop: "10px" }}
            > */}

            <Checkbox
              style={{ marginLeft: "20px" }}
              disabled={canSetDisabled}
              onChange={({ target: { checked } }) =>
                props.onChange(checked, JSON.parse(JSON.stringify(op)))
              }
            >
              {op.name}
            </Checkbox>

            <span
              style={{ float: "right", marginRight: "15px" }}
              className={`modfier-amount ${strikeOutFree}`}
            >
              ( {props.currency} {props.getModifierPrice(op.price)} )
            </span>
            {/* </label> */}
          </section>
        );
      })}
    </div>
  );
};
export default OptionalModifier;
