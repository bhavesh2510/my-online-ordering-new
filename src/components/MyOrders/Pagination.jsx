import React, { useState, useEffect } from "react";
import "./MyOrders.css";

const Pagination = ({ showPerPage, onPaginationChange, total }) => {
  console.log("length is", total);
  const [counter, setCounter] = useState(1);
  const [numberOfButtons, setNumberOfButoons] = useState(
    Math.ceil(total / showPerPage)
  );
  const [end, setEnd] = useState();
  useEffect(() => {
    const value = showPerPage * counter;
    setEnd(value);
    onPaginationChange(value - showPerPage, value);
    console.log("value is", value);
  }, [counter]);

  const onButtonClick = (type) => {
    if (type === "prev") {
      if (counter === 1) {
        setCounter(1);
      } else {
        setCounter(counter - 1);
      }
    } else if (type === "next") {
      if (numberOfButtons === counter) {
        setCounter(counter);
      } else if (total == end) {
        // var x = document.getElementById("next-id");
        // x.classList.add("remove-button");
      } else {
        setCounter(counter + 1);
      }
    }
  };
  return (
    <div className="d-flex justify-content-center">
      {total > 9 ? (
        <>
          <nav aria-label="Page navigation example">
            <ul class="pagination" id="next-id">
              <div className="pagination-button-container">
                <li class="page-item" className="pagination-button-li">
                  <a
                    className="pagination-button-a"
                    class="page-link"
                    //   href="!#"
                    onClick={() => onButtonClick("prev")}
                  >
                    Previous
                  </a>
                </li>
                &nbsp; &nbsp;
                {/* {new Array(numberOfButtons).fill("").map((el, index) => (
                  <li
                    class={`page-item ${
                      index + 1 === counter ? "active" : null
                    }`}
                  >
                    <a
                      class="page-link"
                      // href="!#"
                      onClick={() => setCounter(index + 1)}
                    >
                      {index + 1}
                    </a>
                  </li>
                ))} */}
                <li class="page-item" className="pagination-button-li">
                  <a
                    className="pagination-button-a"
                    class="page-link"
                    //   href="!#"
                    onClick={() => onButtonClick("next")}
                  >
                    Next
                  </a>
                </li>
              </div>
            </ul>
          </nav>
        </>
      ) : null}
    </div>
  );
};

export default Pagination;
