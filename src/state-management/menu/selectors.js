import { createSelector } from "reselect";
import { isHappyHourStillActive } from "./utils";

export const getFilterredList = createSelector(
  [
    ({ menu }) => menu.menuItems,
    ({ menu }) => menu.pizzas,
    ({ menu }) => menu.selectedCategoryId,
    ({ menu }) => menu.searchQuery,
    ({ menu }) => menu.displayHappyHours,
    ({ main }) =>
      main.selectedRestaurant ? main.selectedRestaurant.timezone : null,
  ],
  (
    menuItems,
    pizzas,
    selectedCategoryId,
    searchQuery,
    displayHappyHours,
    timezone
  ) => {
    if (searchQuery.trim().length) {
      console.log("in selector happyhour 1");
      const searchText = searchQuery.toLowerCase();

      return menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText) ||
          item.description.toLowerCase().includes(searchText)
      );
    }

    console.log("in selector happyhour");

    if (displayHappyHours && timezone) {
      console.log("in selector happyhour 2");
      var temp_arr = [];
      temp_arr.push(menuItems);

      temp_arr.push(pizzas);
      console.log("temp_arr in selctor", temp_arr);
      var complete_array = [];
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < temp_arr[i].length; j++) {
          complete_array.push(temp_arr[i][j]);
        }
      }
      console.log("complete array in selectors", complete_array);

      for (let i = 0; i < 2; i++) {
        return complete_array.filter(
          (item) =>
            item.happyHourDetail &&
            isHappyHourStillActive(item, timezone).isActive
        );
      }
    }
    console.log("in selector happyhour 3");
    return menuItems.filter(
      (item) =>
        item.productType === selectedCategoryId ||
        item["category_id"] === selectedCategoryId
    );
  }
);
