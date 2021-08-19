import "./RestrictUser.css";
import Restrict from "./restrict.png";
const RestrictUser = () => {
  return (
    <>
      <div className='restrict-container'>
        <img
          src={Restrict}
          height='150px'
          width='150px'
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            display: "block",
          }}
        />
        <br />
        <p className='restrict-user'>
          You don't have permission to view this page
        </p>
      </div>
    </>
  );
};
export default RestrictUser;
