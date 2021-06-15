import React, { useState } from "react";
import { Checkbox } from "antd";
import { connect } from "react-redux";
import "./Detours.scss";

const Detours = React.memo(
  ({
    optionalModifierId,
    currency,
    allOptionalModifier,
    getModifierPrice,
    onDetourSelectionChange,
  }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const detourOptions = allOptionalModifier.filter((item) => {
      if (Number(optionalModifierId) === Number(item.om_cat_id)) {
        return item;
      }
    });

    console.log("detouropt", detourOptions);

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

    function getTotalPrice(updatedItems) {
      return updatedItems.reduce(
        (acc, item) => acc + (item.isFree ? 0 : Number(item.price)),
        0
      );
    }

    function setFreeLimitPrices(allItems) {
      // update free limit items prices
      const priceSortedItems = allItems.sort((a, b) => a.price - b.price);

      const freeLimit = Number(detourOptions[0].free_limit);
      const limit =
        freeLimit > priceSortedItems.length
          ? priceSortedItems.length
          : freeLimit;

      for (let i = 0; i < limit; i++) {
        priceSortedItems[i].isFree = true;
      }
      for (let i = limit; i < priceSortedItems.length; i++) {
        priceSortedItems[i].isFree = false;
      }

      return priceSortedItems;
    }

    const handleChange = (checked, option) => {
      let newSelectedOptions = [];

      let withFreeLimitItems = [];

      if (checked) {
        newSelectedOptions = [...selectedOptions, option];
      } else {
        newSelectedOptions = selectedOptions.filter(
          ({ id }) => id !== option.id
        );
      }
      withFreeLimitItems = setFreeLimitPrices(newSelectedOptions);
      setSelectedOptions(withFreeLimitItems);

      // check if max limit has crossed for optional category items
      isMaxLimit(withFreeLimitItems, option);
      onDetourSelectionChange && onDetourSelectionChange(withFreeLimitItems);
    };

    function renderOptions() {
      const catDetails = {
        omCatId: detourOptions[0].om_cat_id,
        maxLimit: detourOptions[0].max_limit,
      };
      const isMaxLimitReached = isMaxLimit(selectedOptions, catDetails);

      return detourOptions[0].items.map((option, i) => {
        const canSetDisabled =
          isMaxLimitReached &&
          !selectedOptions.some(
            ({ id, omCatId }) => id === option.id && omCatId === option.omCatId
          );
        const currentItem = selectedOptions.find(
          (item) => item.id === option.id
        );
        const strikeOutFree =
          currentItem && currentItem.isFree ? "free-amount" : "";

        return (
          <>
            {/* <section style={{ display: "inline-flex" }} key={i}>
             <label className="label"> */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Checkbox
                style={{ fontSize: "13px" }}
                disabled={canSetDisabled}
                onChange={({ target: { checked } }) =>
                  handleChange(checked, option)
                }
              >
                {option.name}
              </Checkbox>
              {/* </label> */}
              <p
                style={{ textAlign: "right", fontSize: "13px" }}
                className={`modifier-amount ${strikeOutFree}`}
              >
                {currency} {getModifierPrice(option.price)}
              </p>
            </div>
            {/* </section> */}
          </>
        );
      });
    }

    return (
      <div
        className="detour-options"
        style={{
          marginLeft: "-20px",
          marginTop: "10px",
          border: "1px solid black",
          padding: "10px",
          borderRadius: "8px",
        }}
        key={optionalModifierId.om_cat_id}
      >
        <h5 className="category-name">{detourOptions[0].om_cat_name}</h5>
        <span className="modifier-category-instruction">
          {detourOptions[0].free_limit > 0
            ? `Cheapest ${detourOptions[0].free_limit} options will be free`
            : null}
          {detourOptions[0].free_limit > 0 && detourOptions[0].max_limit > 0
            ? ", "
            : null}
          {detourOptions[0].max_limit > 0
            ? `You can choose max upto ${detourOptions[0].max_limit} options`
            : null}
        </span>
        {renderOptions()}
      </div>
    );
  }
);

function mapStateToProps(state) {
  return {
    dishModalData: state.menu.dishModalData,
    allForcedModifier: state.menu.allForcedModifier,
    allOptionalModifier: state.menu.allOptionalModifier,
    currency: state.main.selectedRestaurant.monetary_symbol,
  };
}

export default connect(mapStateToProps)(Detours);
