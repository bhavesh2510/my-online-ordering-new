import RestaurantList from "./containers/RestaurantList/RestaurantList";
import { BrowserRouter as Router } from "react-router-dom";
import { Redirect, Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import Appheader from "./components/AppHeader/AppHeader";
import Footer from "./components/Footer/Footer";
import Checkout from "./components/Checkout/Checkout";
import { useState } from "react";
import "antd/dist/antd.css";

function App() {
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
