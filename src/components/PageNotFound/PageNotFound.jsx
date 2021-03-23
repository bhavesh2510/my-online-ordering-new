import React from "react";
// import "./PageNotFound.scss";

const PageNotFound = React.memo(() => (
  <div className="page-not-found">
    <h1>404</h1>
    <h3>Looks like the page you are looking for, does not exist!</h3>
  </div>
));

export default PageNotFound;