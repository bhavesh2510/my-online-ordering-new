const Address = ({ address }) => {
  console.log("adderss in add address", address);
  return (
    <>
      <ul
        className='address-lines'
        //onClick={() => onClick && onClick(address)}
      >
        <li style={{ marginTop: "0px" }}>
          <span>
            <p
              className='address_name'
              style={{
                textTransform: "capitalize",
                marginLeft: "-10px",
                borderRadius: "5px",
                paddingTop: "5px",
                textAlign: "center",
                fontSize: "20px",
                height: "30px",
                width: "80px",
                //backgroundColor: "black",
                //color: "white",
              }}
            >
              {address.type}
            </p>
          </span>
        </li>

        <li>
          <span>
            <h5 className='address_name'>{address.name}</h5>
          </span>
        </li>
        <div className='for-mobile'>
          <li>
            <span>{address.address1}</span> &nbsp;{" "}
            <span>{address.address2}</span>
          </li>

          <li>
            <span>
              {address.city == "undefined" ? "" : address.city}
              {address.zipcode}
            </span>
          </li>
        </div>

        <li>
          <span>
            {address.state == "undefined" ? "" : address.state}
            <span>{address.country}</span>
          </span>
        </li>
      </ul>
    </>
  );
};
export default Address;
