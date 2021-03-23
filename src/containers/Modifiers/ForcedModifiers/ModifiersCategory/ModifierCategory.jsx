import React, { useState } from 'react'
import { FormGroup, Input, Label } from 'reactstrap';

const ModifierCategory = ({fItem, symbol, detours}) => {
    const [selectedModifierOption, setModifierOption] = useState('')
    const getSelectedModifierCategoryId = (id) =>{
        setModifierOption(id);

    }
    return (
      <div
        key={fItem.id}
        style={{
          //   background: "red",
          display: "flex",
          justifyContent: "space-between",
          margin: "10px",
          height: "20px",
        }}
      >
        <FormGroup check >
          <Label check>
            <Input type="radio" name="fRadio" /> {fItem.name}
          </Label>
        </FormGroup>
        {/* { isChecked ?  <ModifierOptions /> : null} */}
        <span style={{ display: "block" }}>
          {symbol}&nbsp;{fItem.price}
        </span>
        
      </div>
    );
}

const ModifierOptions = React.memo(({ item, optionId}) =>{
    // const detours = getForcedModifiersDetours(item, optionId)
    return (
        <>

        </>
    )
});


export default ModifierCategory


