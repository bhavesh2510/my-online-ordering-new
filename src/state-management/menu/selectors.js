import { createSelector } from 'reselect';
import { isHappyHourStillActive } from './utils';

export const getFilterredList = createSelector(
  [
    ({ menu }) => menu.menuItems,
    ({ menu }) => menu.selectedCategoryId,
    ({ menu }) => menu.searchQuery,
    ({ menu }) => menu.displayHappyHours,
    ({ main }) => main.selectedRestaurant ? main.selectedRestaurant.timezone : null,
  ],
  (menuItems, selectedCategoryId, searchQuery, displayHappyHours, timezone) => {
    if (searchQuery.trim().length) {
      const searchText = searchQuery.toLowerCase();

      return menuItems
        .filter((item) => (item.name.toLowerCase().includes(searchText) || item.description.toLowerCase().includes(searchText)));
    }

    if (displayHappyHours && timezone) {
      return menuItems.filter((item) => item.happyHourDetail && isHappyHourStillActive(item, timezone).isActive);
    }

    return menuItems.filter((item) => item.productType === selectedCategoryId || item['category_id'] === selectedCategoryId);
  },
);