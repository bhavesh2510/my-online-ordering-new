import React from "react";
import { FormGroup, Input, Label } from "reactstrap";
import ModifierCategory from "./ModifiersCategory/ModifierCategory";

const ForcedModifiers = ({ forcedModifier, symbol, radioSelect }) => {
  return (
    <div style={{ width: "100%" }}>
      {console.log("comp forcedModifier", forcedModifier)}
      {forcedModifier.map((item) => {
        if (item) {
          return (
            <>
              <h4>{item.fm_cat_name}</h4>
              <span>Please select only 1 of the following options</span>
              {item.items.map((fItem) => {
                return (
                  <ModifierCategory
                    selectItem={radioSelect}
                    valueOfRadio={fItem}
                    detours={item.detour_ids}
                    fItem={fItem}
                    symbol={symbol}
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
