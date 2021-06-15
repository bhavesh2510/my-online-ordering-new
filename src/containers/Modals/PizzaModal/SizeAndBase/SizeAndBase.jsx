import React from "react";
import { Select } from "antd";

const SizeAndBase = ({ sizeAndBaseList, currency, handleSizeBaseChange }) => {
  if (sizeAndBaseList.length === 0) {
    return null;
  }

  const { Option } = Select;

  const options = [];

  for (let i = 0; i < sizeAndBaseList.length; i++) {
    options.push(
      <>
        <Option
          key={`sizeAndBase${i}`}
          value={`${sizeAndBaseList[i].sizeId},${sizeAndBaseList[i].baseId}`}
        >
          {sizeAndBaseList[i].name}
        </Option>
      </>
    );
  }

  return (
    <div
      className="size-and-base"
      style={{ backgroundColor: "#f9f9f9", marginBottom: "20px" }}
    >
      <span
        style={{ marginLeft: "10px" }}
        className="header-text text-pizzamodal"
      >
        Select your size & crust
      </span>

      <Select
        className="text-pizzamodal"
        style={{
          marginTop: "20px",
          marginLeft: "10px",
          marginBottom: "20px",
          width: "90%",
        }}
        defaultValue={sizeAndBaseList[0].name}
        onChange={(val) => handleSizeBaseChange(val)}
      >
        {options}
      </Select>
    </div>
  );
};

export default SizeAndBase;