const Address = ({ address }) => {
  return (
    <>
      <ul
        className="address-lines"
        //onClick={() => onClick && onClick(address)}
      >
        <li style={{ marginTop: "0px" }}>
          <span>
            <p
              className="address_name"
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
            <h5 className="address_name">{address.name}</h5>
          </span>
        </li>
        <li>
          <span>{address.address1}</span>
        </li>
        <li>
          <span>{address.address2}</span>
        </li>
        <li>
          <span>
            {address.city} - {address.zipcode}
          </span>
        </li>

        <>
          <li>
            <span>{address.state || "state"}</span>
          </li>
        </>

        <li>
          <span>{address.country}</span>
        </li>
      </ul>
    </>
  );
};
export default Address;
