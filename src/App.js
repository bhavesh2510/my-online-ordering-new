import RestaurantList from "./containers/RestaurantList/RestaurantList";
import { BrowserRouter as Router } from "react-router-dom";
import { Redirect, Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import Appheader from "./components/AppHeader/AppHeader";
import Footer from "./components/Footer/Footer";
import Checkout from "./components/Checkout/Checkout";
import React, { Fragment, useEffect, useState } from "react";
import "antd/dist/antd.css";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";

function App() {
  const [isLoading, setLoading] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     fetch("https://randomuser.me/api/?results=100")
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setUsers(data.results);
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         setLoading(false);
  //         setError(true);
  //       });
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);
  const [state, setState] = useState(true);
  const menu = useSelector((state) => state.menu);
  return (
    <div className="App">
      <Router>
        {/* <Appheader /> */}
        <RestaurantList />

        {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
