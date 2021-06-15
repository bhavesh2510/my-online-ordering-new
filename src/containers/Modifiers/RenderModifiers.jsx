import React from "react";
//import "./Modifiers.scss";

const RenderModifiers = ({ modifier }) => {
  function getRenderableOptionalModifiers(optionalModifiers) {
    return (
      optionalModifiers && optionalModifiers.map(({ name }) => name).join(", ")
    );
  }

  function getRenderableForcedModifiersModifiers(forcedModifiers) {
    return (
      forcedModifiers &&
      forcedModifiers.map(({ name, optionalModifiers }) => {
        if (optionalModifiers && optionalModifiers.length) {
          return (
            <div className="modifier-group">
              <span className="forced ">{`${name}: `}</span>
              <span className="optional ">
                {getRenderableOptionalModifiers(optionalModifiers)}
              </span>
              {/* <span className="separator">|</span> */}
            </div>
          );
        }

        return (
          <div className="modifier-group" style={{ display: "inline" }}>
            <span className="forced ">{name},</span> &nbsp;
            {/* <span className="separator">||</span> */}
          </div>
        );
      })
    );
  }

  function renderModifier() {
    const optionalModifiers = modifier ? modifier.optionalModifier : [];
    const forcedModifiers = modifier ? modifier.forcedModifier : [];

    return (
      <div className="modifiers-container">
        <span
          className="forced-modifiers text-pizzamodal"
          style={{ fontSize: "10px" }}
        >
          {getRenderableForcedModifiersModifiers(forcedModifiers)}
        </span>
        <span
          className="optional-modifiers text-pizzamodal"
          style={{ fontSize: "10px" }}
        >
          {getRenderableOptionalModifiers(optionalModifiers)}
        </span>
      </div>
    );
  }

  return (
    <div className="modifiers" style={{ display: "flex" }}>
      {renderModifier()}
    </div>
  );
};

export default RenderModifiers;
