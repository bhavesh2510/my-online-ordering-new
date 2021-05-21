import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import MenuTable from "../../components/MenuTable/MenuTable";
import { getTaxes } from "../../state-management/menu/operations";
const MenuItems = React.memo(
  ({
    categories,
    pizzas,
    happyhours,
    selectedCategoryId,
    menuItems,
    restaurantInfo,
    searchQuery,
  }) => {
    //! [x] Need to refractored, should create a seperate Table (presentational component)
    //! Should filter isOnline isHappyhour active and need to implement details page for menun with subcategory,
    //! Should implement modifiers for the menu items,
    //? Need code splitting, load lazily because this is data intensive operation, create a suspense in main route.

    //? Need to filter Pizzas and HappyHours based on isActive and isOnline
    const menu = useSelector((state) => state.menu);
    const allforcedModifiers = menu.allForcedModifier;
    const findCategory = (selectedCategoryId) => {
      console.log("memoized value");
      return menuItems.filter(
        ({ category_id: cid, online }) =>
          cid === selectedCategoryId && online === "1"
      );
    };

    const filteredIems = useMemo(() => findCategory(selectedCategoryId), [
      selectedCategoryId,
    ]);

    function getSelectedCategoryName() {
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
        );
        console.log("category", category);
        const subCategory =
          category &&
          category["sub_category"] &&
          category["sub_category"].find(
            ({ category_id: cId }) => cId === selectedCategoryId
          );
        console.log("subcategory is", subCategory);
        // cname = subCategory ? subCategory.cname : "";
        return subCategory ? subCategory.cname : "";
      }

      if (selectedCategoryId === -1) {
        return "Happy Hours";
      } else if (selectedCategoryId === -2) {
        return "Pizza's";
      }
    }

    const isPriceWithoutTax = () => {
      return Number(menu.restaurantInfo["price_without_tax_flag"]);
    };

    const getActualPrice = (item) => {
      //console.log("item.price", item.price);
      if (menu.restaurantInfo) {
        // console.log("actual price", typeof(this.isPriceWithoutTax()));
        return isPriceWithoutTax()
          ? item.price
          : (
              Number(item.price) +
              Number(getTaxes(item, item.price, menu.restaurantInfo).tax)
            ).toFixed(2);
      }

      return 0;
    };

    const getItemPrice = (item, isStillActive) => {
      if (item.happyHourItem && isStillActive) {
        if (item.similarItems && item.similarItems.length > 0) {
          let totalPrice = 0;

          for (let i = 0; i < item.similarItems.length; i++) {
            totalPrice += this.isPriceWithoutTax()
              ? item.similarItems[i].happyHourItem.subTotal
              : item.similarItems[i].happyHourItem.grandTotal;
          }

          return Number(totalPrice).toFixed(2);
        } else {
          console.log("sub", Number(item.happyHourItem.subTotal).toFixed(2));
          console.log(
            "grand",
            Number(item.happyHourItem.grandTotal).toFixed(2)
          );
          return this.isPriceWithoutTax()
            ? Number(item.happyHourItem.subTotal).toFixed(2)
            : Number(item.happyHourItem.grandTotal).toFixed(2);
        }
      } else if (item.subTotal && item.grandTotal) {
        if (item.similarItems && item.similarItems.length > 0) {
          let totalPrice = 0;

          for (let i = 0; i < item.similarItems.length; i++) {
            totalPrice += this.isPriceWithoutTax()
              ? item.similarItems[i].subTotal || item.similarItems[i].price
              : item.similarItems[i].grandTotal ||
                this.getActualPrice(item.similarItems[i]);
          }

          return Number(totalPrice).toFixed(2);
        } else {
          console.log(
            "log",
            this.isPriceWithoutTax()
              ? item.subTotal || item.price
              : item.grandTotal || this.getActualPrice(item)
          );
          return this.isPriceWithoutTax()
            ? item.subTotal || item.price
            : item.grandTotal || this.getActualPrice(item);
        }
      }
    };

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

        {console.log("fltered items", filteredIems)}
        {console.log("check product type", filteredIems[0]?.productType)}
        {filteredIems[0]?.productType === "Dishes" ||
        filteredIems[0]?.productType === "Drinks" ? (
          <MenuTable
            symbol={restaurantInfo.monetary_symbol}
            actualPrice={getActualPrice}
            category_name={getSelectedCategoryName()}
            list={filteredIems}
          />
        ) : null}
        {selectedCategoryId === -2 ? (
          <MenuTable
            symbol={restaurantInfo.monetary_symbol}
            category_name="Pizza"
            list={pizzas}
          />
        ) : null}
        {selectedCategoryId === -1 ? (
          <MenuTable
            symbol={restaurantInfo.monetary_symbol}
            category_name="Happy Hours"
            list={happyhours}
          />
        ) : null}
      </>
    );
  }
);

export default MenuItems;
