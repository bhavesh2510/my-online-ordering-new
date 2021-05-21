import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const PaymentFailed = () => {
  const menu = useSelector((state) => state.menu);
  return (
    <>
      <div className="failed" style={{ alignItems: "center" }}>
        <img
          style={{ marginTop: "10%", marginLeft: "42%" }}
          src="https://i.ibb.co/StsVjS2/Failed.png"
        />{" "}
        <br />
        <p style={{ fontSize: "50px", marginLeft: "30%" }}>
          Your Payment is Failed
        </p>
        <Link
          style={{ marginLeft: "40%", fontSize: "30px" }}
          to={`/restId=${menu.restaurantInfo.restaurant_id}/menu`}
        >
          Please try again
        </Link>
      </div>
    </>
  );
};
export default PaymentFailed;
