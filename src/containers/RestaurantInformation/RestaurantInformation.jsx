import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import {useSelector,useDispatch} from 'react-redux'
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
const RestaurantInformation = (props) => {
    const dispatch = useDispatch()
    const user = useSelector((state)=>state.user)
    const main = useSelector((state)=>state.main)
    const menu = useSelector((state)=>state.menu)
    const [loading, setLoading] = useState(true)
    const initialize = async () =>{
        dispatch(initializeStoreState(props.restaurantId));
        dispatch(fetchHappyHours(props.restaurantId));
        dispatch(fetchMenuItems(props.restaurantId));
        dispatch(fetchPizzas(props.restaurantId));
        dispatch(fetchRestuarantDeliveryRange(props.restaurantId));
        await dispatch(fetchCategories(props.restaurantId));
        dispatch(fetchAllForcedModifiers(props.restaurantId));
        dispatch(fetchAllOptionalModifiers(props.restaurantId));
        setLoading(false)

    }

    useEffect(()=>{
        initialize()
    },[])

    // console.log("user",user, "menu",menu, "main", main);
    const handleAddItem = (item) => {
      
    }
    const handleRemoveItem = () => {
        
    }
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
   }
  return (
    <>
      {/* {console.log("ResInfo-props", props)} */}
      {/* {console.log("user", user, "menu", menu, "main", main)} */}
      {loading && <LoadingBar />}
      <Switch>
        <Route exact path={`/restId=${props.restaurantId}`}>
          <Redirect to={`/restId=${props.restaurantId}/menu`} />
        </Route>
        <Route
          exact
          path={`/restId=${props.restaurantId}/menu`}
          children={renderMenuItems()}
        />
        <Route
          exact
          path={`/restId=${props.restaurantId}/myOrders`}
        >
          <MyOrders restaurantId={props.restaurantId} />
        </Route>
      </Switch>
    </>
  );
};

export default RestaurantInformation;
