import React, { Fragment, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openModal, closeModal } from "../../state-management/modal/actions";
import { modalNames } from "../../components/AppModal/constants";
import {
  fetchCategories,
  fetchMenuItems,
  fetchPizzas,
  fetchAllForcedModifiers,
  fetchAllOptionalModifiers,
  fetchHappyHours,
  fetchCoupons,
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
  fetchClosedInformation,
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
//import LoadingBar from "../../components/LoadingBar/LoadingBar";
import ScrollToTop from "./ScrollToTop";
import {
  isHappyHourStillActive,
  setTimer,
} from "../../state-management/menu/utils";
import {
  postMyProfileForm,
  postProfile,
} from "../../state-management/user/asyncActions";
import moment from "moment";
const RestaurantInformation = (props) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const main = useSelector((state) => state.main);
  const menu = useSelector((state) => state.menu);
  const [loading, setLoading] = useState(true);

  const dataforcoupon = {
    date: moment().format("yyyy-MM-DD"),
    restaurant_id: props.restaurantId,
  };

  const initialize = async () => {
    await dispatch(initializeStoreState(props.restaurantId));
    await dispatch(postMyProfileForm(user.user.clientId));
    await dispatch(fetchHappyHours(props.restaurantId));
    await dispatch(fetchMenuItems(props.restaurantId));
    await dispatch(fetchCategories(props.restaurantId));

    await dispatch(fetchClosedInformation(props.restaurantId, props.timezone));
    await dispatch(
      fetchCoupons(moment().format("yyyy-MM-DD"), props.restaurantId)
    );
    setLoading(false);
    await dispatch(fetchAllForcedModifiers(props.restaurantId));
    await dispatch(fetchAllOptionalModifiers(props.restaurantId));
    await dispatch(fetchPizzas(props.restaurantId));
    await dispatch(fetchRestuarantDeliveryRange(props.restaurantId));
  };

  useEffect(() => {
    console.log("===================================");
    if (props.restaurantId) initialize();
  }, [props.restaurantId]);

  // console.log("user",user, "menu",menu, "main", main);
  const handleAddItem = (item, isHappyHoursActive) => {
    const menuItems = menu.menuItems;
    const itemsinmenu = menuItems.find(({ id }) => item.id === id);
    console.log("items at the time of add", itemsinmenu);

    if (item.optional_modifier !== "0" || item.forced_modifier !== "0") {
      if (itemsinmenu.qty) {
        dispatch(
          openModal(modalNames.INTERMEDIATE_ADD_MODAL, {
            item: {
              ...item,
              isHappyHoursActive,
            },
          })
        );
      } else {
        dispatch(
          openModal(modalNames.DISH_MODAL, {
            item: {
              ...item,
              isHappyHoursActive,
            },
          })
        );
      }

      return;
    }

    //this.props.addItem(item, null, 0, this.props.restaurantInfo);

    dispatch(
      addItem(
        itemsinmenu,
        itemsinmenu.modifiers || null,
        0,
        menu.restaurantInfo
      )
    );
  };
  const handleRemoveItem = (item) => {
    dispatch(removeItem(item, item.modifiers || null, 0, menu.restaurantInfo));
  };
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
        loading={loading}
      />
    );
  };
  return (
    <>
      {/* {console.log("ResInfo-props", props)} */}
      {/* {console.log("user", user, "menu", menu, "main", main)} */}
      {/* {loading && <LoadingBar />} */}
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
          <ScrollToTop />
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
