import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCategoryId, displayHappyHours, displayPizzas } from "../../state-management/menu/actions";
import {Link as ScrollLink, animateScroll as scroll} from 'react-scroll'
const MenuCategories = React.memo(({ categories }) => {
  const menu = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const [dishes, showDishes] = useState(false)
  const [drinks, showDrinks] = useState(false) 
  const isPizzaAvailable = menu.pizzas.length;
  const isHappyHoursActive = isHappyHoursActiveInMenu();


  const onDishClick  = () => {
    showDishes(!dishes)
  }
  const onDrinksClick = () =>{
    showDrinks(!drinks)
    
  }
  function isHappyHoursActiveInMenu() {
    return menu.menuItems.some(({ isHappyHourActive }) => isHappyHourActive);
  }


  return (
    <>
      <div className="box_style_1">
        <ul id="cat_nav">
          {console.log("categories", categories)}
          {console.log("menu items", menu.menuItems)}
          {menu.isHappyHoursApplicable && isHappyHoursActive ? (
            <li key="happyHours" style={{ cursor: "pointer" }}>
              <ScrollLink
                activeClass="active"
                smooth={true}
                spy={true}
                to="Happy Hours"
                offset={-70}
                onClick={() => {
                  dispatch(displayHappyHours());
                }}
              >
                Happy hours <span> ({menu?.happyHours?.length}) </span>
              </ScrollLink>
            </li>
          ) : null}
          <li style={{ cursor: "pointer" }}>
            <ScrollLink
              activeClass="active"
              smooth={true}
              spy={true}
              to={dishes ? "" : categories[0]?.cname}
              offset={-70}
              onClick={onDishClick}
            >
              Dishes <span>({categories[0]?.sub_category.length})</span>{" "}
            </ScrollLink>
          </li>
          {categories.map((category, i) => {
            return category.cname === "Dishes" && dishes ? (
              <MenuSubCategory
                list={category.sub_category}
                searchQuery={menu.searchQuery}
                selectedCategoryId={menu.selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
              />
            ) : null;
          })}
          <li style={{ cursor: "pointer" }}>
            <ScrollLink
              activeClass="active"
              smooth={true}
              spy={true}
              to={drinks ? "" : categories[1]?.cname}
              offset={-70}
              onClick={onDrinksClick}
            >
              Drinks<span>({categories[1]?.sub_category.length})</span>
            </ScrollLink>
          </li>
          {categories.map((category, i) => {
            return category.cname === "Drinks" && drinks ? (
              <MenuSubCategory
                list={category.sub_category}
                searchQuery={menu.searchQuery}
                selectedCategoryId={menu.selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                // hideCategoryList={() => hideCategory()}
              />
            ) : null;
          })}
          {isPizzaAvailable ? (
            <li key="pizza" style={{ cursor: "pointer" }}>
              <ScrollLink
                activeClass="active"
                smooth={true}
                spy={true}
                to="Pizza"
                offset={-70}
                onClick={() => dispatch(displayPizzas())}
              >
                Pizza's <span> ({isPizzaAvailable}) </span>
              </ScrollLink>
            </li>
          ) : null}
        </ul>
      </div>
    </>
  );
});

const MenuSubCategory = React.memo(({list, searchQuery, selectedCategoryId, setSelectedCategoryId}) =>{
  const dispatch = useDispatch();
  const handleClick = (e, item) =>{
    // e.stopPropagation();
    dispatch(setSelectedCategoryId(item.category_id))
    console.log(item);
  }
  return list.map((s_category) => {
    return (
      <li key={s_category.category_id} style={{ cursor: "pointer" }} onClick = {(e)=>handleClick(e, s_category)}>
        <a style={{ color: "#5B53CD" }}>{s_category?.cname}</a>
      </li>
    );
  });
})

export default MenuCategories;
