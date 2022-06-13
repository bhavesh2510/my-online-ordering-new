import React, { useEffect, useMemo, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import MenuTable from "../../components/MenuTable/MenuTable"
import PizzaMenuTable from "../../components/MenuTable/PizzaMenuTable"
import { getTaxes } from "../../state-management/menu/operations"
import { getFilterredList } from "../../state-management/menu/selectors"
import Skeleton from "react-loading-skeleton"
import { addItem, removeItem } from "../../state-management/menu/actions"
import { displayHappyHours } from "../../state-management/menu/actions"

const MenuItems = React.memo(
  ({
    onAddItem,
    onRemoveItem,
    categories,
    pizzas,
    happyhours,
    selectedCategoryId,
    menuItems,
    restaurantInfo,
    searchQuery,
    loading,
    status
  }) => {
    //! [x] Need to refractored, should create a seperate Table (presentational component)
    //! Should filter isOnline isHappyhour active and need to implement details page for menun with subcategory,
    //! Should implement modifiers for the menu items,
    //? Need code splitting, load lazily because this is data intensive operation, create a suspense in main route.

    //? Need to filter Pizzas and HappyHours based on isActive and isOnline
    const menu = useSelector((state) => state.menu)
    const state = useSelector((state) => state)
    const [hhour, sethhour] = useState(false)
    const dispatch = useDispatch()
    console.log("status in menuiten", status)

    console.log("loading in menuTable", loading)

    const allforcedModifiers = menu.allForcedModifier
    var array_of_ids = []
    var tem_arr_cname = []
    var list = (menuItems = getFilterredList(state))
    console.log("happ hour array ", list)

    const func = () => {
      var tem_arr = []

      var dish_subcat_id = []
      var dish_cname = []
      var drink_subcat_id = []
      var drink_cname = []

      if (menu.categoriesList[0]) {
        for (let i = 0; i < menu.categoriesList[0].sub_category.length; i++) {
          dish_subcat_id.push(
            menu.categoriesList[0].sub_category[i].category_id
          )
          dish_cname.push(menu.categoriesList[0].sub_category[i].cname)
        }
        array_of_ids.push(dish_subcat_id)
        tem_arr_cname.push(dish_cname)
      }

      if (menu.categoriesList[1]) {
        for (let i = 0; i < menu.categoriesList[1].sub_category.length; i++) {
          drink_subcat_id.push(
            menu.categoriesList[1].sub_category[i].category_id
          )

          dish_cname.push(menu.categoriesList[1].sub_category[i].cname)
        }
      }
      array_of_ids.push(drink_subcat_id)
      tem_arr_cname.push(drink_cname)

      console.log("temp arr cname is", tem_arr_cname)

      for (let j = 0; j < dish_subcat_id.length; j++) {
        tem_arr.push(
          menu.menuItems.filter(
            ({ category_id: cid, online }) =>
              cid === dish_subcat_id[j] && online === "1"
          )
        )
      }

      for (let j = 0; j < drink_subcat_id.length; j++) {
        tem_arr.push(
          menu.menuItems.filter(
            ({ category_id: cid, online }) =>
              cid === drink_subcat_id[j] && online === "1"
          )
        )
      }

      tem_arr = tem_arr.filter(function (x) {
        return x.length
      })

      return tem_arr
    }

    const findCategory = (selectedCategoryId) => {
      console.log("memoized value")

      return menu.menuItems.filter(
        ({ category_id: cid, online }) =>
          cid === selectedCategoryId && online === "1"
      )
    }

    const filteredIems = useMemo(
      () => findCategory(selectedCategoryId),
      [selectedCategoryId]
    )

    function getDishesDescription() {
      if (
        categories.length &&
        selectedCategoryId &&
        selectedCategoryId.length > 0
      ) {
        const category = categories.find(
          (category) =>
            category["sub_category"] &&
            category["sub_category"].find(
              ({ category_id: cId }) => cId === selectedCategoryId
            )
        )
        console.log("category", category)
        const subCategory =
          category &&
          category["sub_category"] &&
          category["sub_category"].find(
            ({ category_id: cId }) => cId === selectedCategoryId
          )
        console.log("subcategory is", subCategory)
        // cname = subCategory ? subCategory.cname : "";
        return subCategory ? subCategory.description : ""
      }
    }
    function getSelectedCategoryName(catname) {
      console.log("catname is xyz", catname)
      console.log("array of id in catname", array_of_ids)
      var req_ids = []
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < array_of_ids[i].length; j++)
          req_ids.push(array_of_ids[i][j])
      }

      console.log("req ids in catnme", tem_arr_cname)
      // if (
      //   categories.length &&
      //   selectedCategoryId &&
      //   selectedCategoryId.length > 0
      // ) {
      //   const category = categories.find(
      //     (category) =>
      //       category["sub_category"] &&
      //       category["sub_category"].find(
      //         ({ category_id: cId }) => cId === selectedCategoryId
      //       )
      //   );
      //   console.log("category in catname", category);

      for (let k = 0; k < req_ids.length; k++) {
        if (
          categories.length &&
          selectedCategoryId &&
          selectedCategoryId.length > 0
        ) {
          const category = categories.find(
            (category) =>
              category["sub_category"] &&
              category["sub_category"].find(
                ({ category_id: cId }) => cId === req_ids[k]
              )
          )
          console.log("category in catname", category)
          const subCategory =
            category &&
            category["sub_category"] &&
            category["sub_category"].find(
              ({ category_id: cId }) => cId === req_ids[k]
            )
          console.log("subcategory in catname", subCategory)
          console.log("break")
          return subCategory ? subCategory.cname : ""
        }
        //console.log("subcategory in catname", subCategory);
        // cname = subCategory ? subCategory.cname : "";
        //return subCategory ? subCategory.cname : "";
      }

      if (selectedCategoryId === -1) {
        return "Happy Hours"
      } else if (selectedCategoryId === -2) {
        return "Pizza's"
      }
    }

    const isPriceWithoutTax = () => {
      return Number(menu.restaurantInfo["price_without_tax_flag"])
    }

    const getActualPrice = (item) => {
      //console.log("item.price", item.price);
      if (menu.restaurantInfo) {
        // console.log("actual price", typeof(this.isPriceWithoutTax()));
        return isPriceWithoutTax()
          ? item.price
          : (
              Number(item.price) +
              Number(getTaxes(item, item.price, menu.restaurantInfo).tax)
            ).toFixed(2)
      }

      return 0
    }

    var a = 1
    // const getItemPrice = (item, isStillActive) => {
    //   if (item.happyHourItem && isStillActive) {
    //     if (item.similarItems && item.similarItems.length > 0) {
    //       let totalPrice = 0;

    //       for (let i = 0; i < item.similarItems.length; i++) {
    //         totalPrice += this.isPriceWithoutTax()
    //           ? item.similarItems[i].happyHourItem.subTotal
    //           : item.similarItems[i].happyHourItem.grandTotal;
    //       }

    //       return Number(totalPrice).toFixed(2);
    //     } else {
    //       console.log("sub", Number(item.happyHourItem.subTotal).toFixed(2));
    //       console.log(
    //         "grand",
    //         Number(item.happyHourItem.grandTotal).toFixed(2)
    //       );
    //       return this.isPriceWithoutTax()
    //         ? Number(item.happyHourItem.subTotal).toFixed(2)
    //         : Number(item.happyHourItem.grandTotal).toFixed(2);
    //     }
    //   } else if (item.subTotal && item.grandTotal) {
    //     if (item.similarItems && item.similarItems.length > 0) {
    //       let totalPrice = 0;

    //       for (let i = 0; i < item.similarItems.length; i++) {
    //         totalPrice += this.isPriceWithoutTax()
    //           ? item.similarItems[i].subTotal || item.similarItems[i].price
    //           : item.similarItems[i].grandTotal ||
    //             this.getActualPrice(item.similarItems[i]);
    //       }

    //       return Number(totalPrice).toFixed(2);
    //     } else {
    //       console.log(
    //         "log",
    //         this.isPriceWithoutTax()
    //           ? item.subTotal || item.price
    //           : item.grandTotal || this.getActualPrice(item)
    //       );
    //       return this.isPriceWithoutTax()
    //         ? item.subTotal || item.price
    //         : item.grandTotal || this.getActualPrice(item);
    //     }
    //   }
    // };

    const removefromcart = (item) => {
      dispatch(removeItem(item, item.modifiers || null, 0, menu.restaurantInfo))
    }

    useEffect(() => {
      dispatch(displayHappyHours())
    }, [])

    return (
      <>
        {/* {console.log("seleted category name", getSelectedCategoryName())}
        {console.log("pizzas", pizzas, "happyhopurs", happyhours)} */}
        {console.log("categories", categories)}
        {/* { (selectedCategoryId !== -1 && selectedCategoryId !== -2) ? categories.map((category) => {
          return category.cname === "Dishes" || category.cname === "Drinks" ? (
            <>
              <MenuTable
                category_name={category.cname}
                list={category.sub_category}
              />
            </>
          ) : null;
        }): null} */}
        {/* {
          selectedCategoryId 
        } */}
        {/* {console.log(
          "find selected category",
          // menuItems.filter(({ category_id: cid }) => cid === selectedCategoryId)
          filteredIems
        )} */}
        {loading ? (
          <>
            {/* <div className="skelton-container">
              <Skeleton height={28} width={400} style={{ marginLeft: "10%" }} />
              <Skeleton height={28} width={300} style={{ marginLeft: "20%" }} />
              <Skeleton height={28} width={300} style={{ marginLeft: "20%" }} />
              <Skeleton height={28} width={400} style={{ marginLeft: "10%" }} />
            </div> */}

            <div className='skelton-container'>
              <div className='parent-menutable'>
                <div className='parent-flex'>
                  <div className='left-menutable-img'>
                    <div className='img-cover-menutable'>
                      <Skeleton height={100} className='img-skelton' />
                    </div>
                  </div>

                  <div className='food-details'>
                    <div className='inner-food-details-div'>
                      <div className='specific-food-details'>
                        <h4 className='food-item-name'>
                          <Skeleton height={20} width={200} count={4} />
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {console.log("fltered items", filteredIems)}
            {console.log("check product type", filteredIems[0]?.productType)}
            {console.log("func is", func())}
            {console.log("array of id", array_of_ids)}

            {status ? (
              <>
                {func().map((val) => {
                  return (
                    <MenuTable
                      symbol={restaurantInfo.monetary_symbol}
                      actualPrice={getActualPrice}
                      //category_name={getSelectedCategoryName(val)}
                      // description={getDishesDescription()}
                      list={val}
                      //list={findAllMenuForDish}
                      onAddItem={onAddItem}
                      onRemoveItem={onRemoveItem}
                      loading={loading}
                    />
                  )
                })}
              </>
            ) : null}

            {/* 
            {filteredIems[0]?.productType === "Dishes" ||
            filteredIems[0]?.productType === "Drinks" ? (
              <MenuTable
                symbol={restaurantInfo.monetary_symbol}
                actualPrice={getActualPrice}
                category_name={getSelectedCategoryName()}
                description={getDishesDescription()}
                list={filteredIems}
                //list={findAllMenuForDish}
                onAddItem={onAddItem}
                onRemoveItem={onRemoveItem}
                loading={loading}
              />
            ) : null} */}
            {console.log("items in menuitem before pizza", pizzas)}
            {/* {status ? (
              <> */}
            {menu.pizzas.length >= 1 && selectedCategoryId !== -1 ? (
              <PizzaMenuTable
                symbol={restaurantInfo.monetary_symbol}
                category_name='Pizza'
                list={pizzas}
                loading={loading}
                removeforpizza={removefromcart}
              />
            ) : null}
            {/* </> */}
            {/* ) : null} */}

            {console.log(
              "checking for happyhour",
              (menuItems = getFilterredList(state))
            )}
            {/* {!status ? (
              <>
                {selectedCategoryId === -1 ? (
                <MenuTable
                  symbol={restaurantInfo.monetary_symbol}
                  category_name='Happy Hours'
                  list={(menuItems = getFilterredList(state))}
                  onAddItem={onAddItem}
                  loading={loading}
                  headerforhappyhour={hhour}
                />
                ) : null}
              </>
            ) : null} */}
          </>
        )}
      </>
    )
  }
)

export default MenuItems
