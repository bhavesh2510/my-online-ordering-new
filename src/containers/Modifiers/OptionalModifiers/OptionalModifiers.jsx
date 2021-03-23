import React from 'react'
import { FormGroup, Input, Label } from 'reactstrap';

const OptionalModifiers = ({ optionalModifier , symbol}) => {
  return(
      <div>
          {optionalModifier.map((item)=>{
              if(item){
                  return(
                      <div key={item.om_cat_id}>
                        <h4>
                            {item.om_cat_name}
                        </h4>
                        {item.items.map((oItem)=>{
                            return (
                              <div
                                key={oItem.id}
                                style={{
                                  //   background: "red",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  margin: "10px",
                                  height: "20px",
                                }}
                              >
                                <FormGroup check>
                                  <Label check>
                                    <Input type="checkbox" id={oItem.id} /> {oItem.name}
                                  </Label>
                                </FormGroup>
                                <span style={{ display: "block" }}>
                                  {symbol}&nbsp;{oItem.price}
                                </span>
                              </div>
                            );
                        })}

                      </div>
                  )
              }
          })}
      </div>
  )
};

export default OptionalModifiers
