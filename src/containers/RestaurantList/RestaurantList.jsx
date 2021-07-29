import React from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
// import RestaurantInformation from "../RestaurantInformation";
import { setSelectedRestaurant } from "../../state-management/main/actions";
import {
  setLoadingDisplay,
  clearMenuState,
  clearState,
  showHideOverlay,
} from "../../state-management/menu/actions";
import {
  fetchRestuarantInformation,
  fetchRestuarantList,
} from "../../state-management/main/asyncActions";
// import "./RestaurantList.scss";
import Restaurants from "./Restaurants/";
import PageNotFound from "../../components/PageNotFound/PageNotFound";
import LoadingBar from "../../components/LoadingBar/LoadingBar";
import RestaurantInformation from "../RestaurantInformation/RestaurantInformation";
import Login from "../../components/Login/Login";
// import { LoadingBar } from "../../components/LoadingBar";

class RestaurantList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { showLoading: true };
    this.initialize();
  }

  async initialize() {
    const param = window.location.href.split("feedmii/?/")[1];

    if (param) {
      const restOrChainId = param.split("=")[0];
      const chainText = param.split("=")[1];

      if (!chainText) {
        this.setState({ showLoading: false });
        this.props.setLoadingDisplay(true);

        return;
      }
      const value = chainText.split("/")[0];

      if (restOrChainId === "chainId") {
        this.fetchRestaurantList(value);
      } else {
        const { payload } = await this.props.fetchRestuarantInformation(value);

        if (payload) {
          this.props.setSelectedRestaurant(payload[0], value);
        }
        this.props.setLoadingDisplay(true);
      }
    }
  }

  async fetchRestaurantList(chainId) {
    await this.props.fetchRestuarantList(chainId);
    this.setState({ showLoading: false });
    this.props.setLoadingDisplay(true);
  }

  handleHomeClick = (chainId) => {
    this.setState({ showLoading: true });
    this.props.setLoadingDisplay(false);
    this.props.clearMenuState();
    this.fetchRestaurantList(chainId);
    window.location.replace(
      `${process.env.REACT_APP_PUBLIC_URL}chainId=${chainId}`
    );
  };

  renderRestaurantList() {
    return <Restaurants restaurants={this.props.restaurants} />;
  }

  render() {
    return (
      <Router basename={process.env.REACT_APP_PUBLIC_URL}>
        {this.props.canShow ? (
          <div className={"restaurant-list-container"}>
            <Switch>
              <Route exact path="/">
                {this.props.restId ? (
                  <Redirect to={`/restId=${this.props.restId}`} />
                ) : (
                  this.renderRestaurantList()
                )}
              </Route>
              <Route
                exact
                path={`/chainId=${this.props.chainId}`}
                children={this.renderRestaurantList()}
              />
              {/* <Route path="*">
                <PageNotFound />
              </Route> */}
              {/* Should fimd a way to redirect 404 */}
            </Switch>

            {console.log(
              "selectedRestaurant",
              this.props.selectedRestaurant.timezone
            )}
            {this.props.selectedRestaurant ? (
              <RestaurantInformation
                timezone={this.props.selectedRestaurant.timezone}
                restaurantId={this.props.restId}
                onHomeClick={this.handleHomeClick}
              />
            ) : null}
          </div>
        ) : (
          ""
        )}
      </Router>
    );
  }
}

function mapStateToProps({ main, menu }) {
  return {
    restaurants: main.restaurants,
    chainId: main.chainId,
    restId: main.restId,
    canShow: menu.canShow,
    displayAddressModal: menu.displayAddressModal,
    selectedRestaurant: main.selectedRestaurant,
    showHideOverlay: menu.showHideOverlay,
    previousSelectedRestaurantId: menu.restaurantId,
  };
}

export const mapDispatchToProps = {
  setSelectedRestaurant,
  fetchRestuarantInformation,
  setLoadingDisplay,
  fetchRestuarantList,
  clearMenuState,
  showHideOverlay,
  clearState,
};

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantList);
