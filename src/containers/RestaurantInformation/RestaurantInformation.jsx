import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategories,
  fetchMenuItems,
  fetchPizzas,
  fetchAllForcedModifiers,
  fetchAllOptionalModifiers,
  fetchHappyHours,
} from "../../state-management/menu/asyncActions";
import {
  setLoadingDisplay,
  addItem,
  removeItem,
  setSearchQuery,
  initializeStoreState,
  clearState,
  clearMenuState,
  displayAddressModal,
} from "../../state-management/menu/actions";
import {
  fetchRestuarantInformation,
  fetchRestuarantList,
  fetchRestuarantDeliveryRange,
} from "../../state-management/main/asyncActions";
import { fetchAddressesList } from "../../state-management/user/asyncActions";
import { setSelectedRestaurant } from "../../state-management/main/actions";
import {
  showLoginFormMethod,
  setSelectedAddress,
} from "../../state-management/user/actions";
import { getFilterredList } from "../../state-management/menu/selectors";
import LoadingBar from "../../components/LoadingBar/LoadingBar";
import Information from "./Information/Information";
import MyOrders from "../../components/MyOrders/MyOrders";
import MyProfile from "../../components/MyProfile/MyProfile";
import ManageAddress from "../../components/ManageAddress/ManageAddress";
import Checkout from "../../components/Checkout/Checkout";
import OrderSuccess from "../../components/OrderSuccess/OrderSuccess";
import PaymentFailed from "../../components/Checkout/PaymentFailed";
import AppModal from "../../components/AppModal/AppModal";
const RestaurantInformation = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const main = useSelector((state) => state.main);
  const menu = useSelector((state) => state.menu);
  const [loading, setLoading] = useState(true);
  const initialize = async () => {
    await dispatch(initializeStoreState(props.restaurantId));
    await dispatch(fetchHappyHours(props.restaurantId));
    await dispatch(fetchMenuItems(props.restaurantId));
    await dispatch(fetchPizzas(props.restaurantId));
    await dispatch(fetchRestuarantDeliveryRange(props.restaurantId));
    await dispatch(fetchCategories(props.restaurantId));
    await dispatch(fetchAllForcedModifiers(props.restaurantId));
    await dispatch(fetchAllOptionalModifiers(props.restaurantId));
    setLoading(false);
  };

  useEffect(() => {
    console.log("===================================");
    if (props.restaurantId) initialize();
  }, [props.restaurantId]);

  // console.log("user",user, "menu",menu, "main", main);
  const handleAddItem = (item) => {};
  const handleRemoveItem = () => {};
  const renderMenuItems = () => {
    return (
      <Information
        searchQuery={menu.searchQuery}
        categories={menu.categoriesList}
        selectedCategoryId={menu.selectedCategoryId}
        menuItems={menu.menuItems}
        pizzas={menu.pizzas}
        categoriesList={menu.categoriesList}
        restaurantInfo={menu.restaurantInfo}
        happyHours={menu.happyHours}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
      />
    );
  };
  return (
    <>
      {/* {console.log("ResInfo-props", props)} */}
      {/* {console.log("user", user, "menu", menu, "main", main)} */}
      {loading && <LoadingBar />}
      <AppModal />
      <Switch>
        <Route exact path={`/restId=${props.restaurantId}`}>
          <Redirect to={`/restId=${props.restaurantId}/menu`} />
        </Route>
        <Route
          exact
          path={`/restId=${props.restaurantId}/menu`}
          children={renderMenuItems()}
        />
        <Route exact path={`/restId=${props.restaurantId}/myProfile`}>
          {user.user.isUserLoggedIn ? <MyProfile /> : null}
          {/* <MyProfile /> */}
        </Route>
        <Route exact path={`/restId=${props.restaurantId}/manageAddress`}>
          {user.user.isUserLoggedIn ? <ManageAddress /> : null}
        </Route>
        <Route exact path={`/restId=${props.restaurantId}/myOrders`}>
          <MyOrders restaurantId={props.restaurantId} />
        </Route>
        <Route exact path={`/restId=${props.restaurantId}/checkout`}>
          <Checkout
            //orderId={generateOrderId()}
            restaurantInfo={menu.restaurantInfo}
            deliveryRange={main.deliveryRange}
            //onAddItem={this.handleAddItem}
            //onRemoveItem={this.handleRemoveItem}
            //displayLogin={this.props.showLoginFormMethod}
            //displayAddressModal={displayAddressModal}
          />
        </Route>{" "}
        <Route exact path={`/restId=${props.restaurantId}/ordersuccess`}>
          <OrderSuccess />
        </Route>{" "}
        <Route exact path={`/restId=${props.restaurantId}/paymentfailed`}>
          <PaymentFailed />
        </Route>{" "}
      </Switch>
    </>
  );
};

export default RestaurantInformation;
