import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { useSelector } from "react-redux";

function PaginationOrderList(props) {
  const menu = useSelector((state) => state.menu);
  useEffect(() => {
    setPosts(props.orderList);
  }, []);
  const [posts, setPosts] = useState([]);
  const [showPerPage, setShowPerPage] = useState(9);
  const [pagination, setPagination] = useState({
    start: 0,
    end: showPerPage,
  });

  const onPaginationChange = (start, end) => {
    setPagination({ start: start, end: end });
    console.log("end is", end);
  };

  return (
    <div className="App">
      <div className="container py-4 px-5">
        <div className="row">
          {posts.slice(pagination.start, pagination.end).map((currval) => (
            <div className="col-md-4 mb-4" key={currval.id}>
              <div
                className="card"
                style={{ border: "1px dotted #302f31", borderRadius: "15px" }}
              >
                <div className="card-body body-container">
                  <div style={{ marginBottom: "-0.5rem" }}>
                    <p
                      className="para"
                      style={{ fontSize: "25px", color: "black" }}
                    >
                      {currval.rname}
                    </p>
                    <p
                      className="number"
                      style={{
                        color: "rgb(156, 156, 156)",
                      }}
                    >
                      {menu.restaurantInfo.city}, {menu.restaurantInfo.country}
                    </p>
                  </div>
                  <hr />
                  <div style={{ marginBottom: "1.2rem" }}>
                    <p className="para">Order Number</p>
                    <p className="number">{currval.order_id}</p>
                  </div>
                  {/* <br /> */}
                  <div style={{ marginBottom: "1.2rem" }}>
                    <p className="para">Total Amount</p>
                    <p className="number">
                      {currval.currency} &nbsp; {currval.grand_total}
                    </p>
                  </div>
                  {/* <br /> */}
                  <div style={{ marginBottom: "1.2rem" }}>
                    <p className="para">Order On</p>
                    <p className="number">{currval.order_date}</p>
                  </div>
                  <div style={{ marginBottom: "1.2rem" }}>
                    <p className="para">Paid</p>
                    <p className="number">
                      {currval.paid == "1" ? "YES" : "NO"}
                    </p>
                  </div>
                  <div
                    className="button-parent"
                    style={{ backgroundColor: "#302f31" }}
                    onClick={() => props.showModal(currval)}
                  >
                    <button className="btn-submit-order-success">
                      View Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          showPerPage={showPerPage}
          onPaginationChange={onPaginationChange}
          total={posts.length}
        />
      </div>
    </div>
  );
}

export default PaginationOrderList;
