import React, { useEffect, useState } from "react";
import "./MenuCategories.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedCategoryId,
  displayHappyHours,
  displayPizzas,
  changechoosencategory,
} from "../../state-management/menu/actions";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { Link } from "react-scroll";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { PinDropSharp } from "@material-ui/icons";
// import { CloseOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import SimpleBarReact from "simplebar-react";
import "simplebar/src/simplebar.css";
import RestaurantIcon from "@material-ui/icons/Restaurant";

const MenuCategories = React.memo(({ categories, loading, drinkstatus }) => {
  const menu = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const [dishes, showDishes] = useState(false);
  const [drinks, showDrinks] = useState(false);

  useEffect(() => {
    if (menu.cart.length >= 1) {
      var x = document.getElementById("id-of-menu");
      // var y = document.getElementById("menu-2");
      x.classList.add("bottom-add");
      //y.classList.add("bottom-add");
    }
    //else {
    //   var x = document.getElementById("id-of-menu");
    //   // var y = document.getElementById("id-of-menu-close");
    //   x.style.bottom = "5%";
    //   // y.style.bottom = "5%";
    // }
  }, [menu.cart.length]);

  const [displayCategoryInMobile, setDisplayCategoryInMobile] = useState("");
  const [displayHideCategory, setdisplayHideCategory] = useState(false);

  const showCategory = () => {
    // props.showHideOverlay(true);
    setDisplayCategoryInMobile("show-mobile-category-list");
    setdisplayHideCategory(true);
  };

  const hideCategory = () => {
    setDisplayCategoryInMobile("");
    setdisplayHideCategory(false);
    // props.showHideOverlay(false);
  };

  const isPizzaAvailable = menu.pizzas.length;
  const isHappyHoursActive = isHappyHoursActiveInMenu();
  console.log("loading in menucategories", loading);

  const onDishClick = (dish) => {
    showDishes(!dishes);
    drinkstatus(true);
    dispatch(displayPizzas());
  };
  const onDrinksClick = () => {
    showDrinks(!drinks);
    drinkstatus(true);
    // dispatch(displayPizzas());
  };
  function isHappyHoursActiveInMenu() {
    return menu.menuItems.some(({ isHappyHourActive }) => isHappyHourActive);
  }

  function showCategoryMobile() {
    if (menu.cart.length >= 1) {
      var x = document.getElementById("id-of-menu");

      x.style.bottom = "12%";
    }
    showCategory();
  }

  function hideCategoryMobile() {
    if (menu.cart.length >= 1) {
      var x = document.getElementById("id-of-menu");

      x.style.bottom = "12%";
    }
    hideCategory();
  }

  return (
    <>
      <div
        className="box_style_1 hide-on-mobile"
        style={{ position: "sticky", top: "65px" }}
      >
        <ul id="cat_nav">
          {console.log("categories", categories)}
          {console.log("menu items", menu.menuItems)}

          <li style={{ cursor: "pointer" }}>
            <Link
              activeClass="active"
              smooth={true}
              spy={true}
              //to="Kebabs"
              //to={dishes ? "" : categories[0]?.cname}
              offset={0}
              onClick={onDishClick}
            >
              Dishes <span>({categories[0]?.sub_category.length})</span>
              <ChevronRightIcon
                fontSize="small"
                style={{ float: "right" }}
              />{" "}
            </Link>
          </li>
          {categories.map((category, i) => {
            return category.cname === "Dishes" && dishes ? (
              <MenuSubCategory
                list={category.sub_category}
                searchQuery={menu.searchQuery}
                selectedCategoryId={menu.selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                drinkstatus={drinkstatus}
                hide={() => hideCategory()}
              />
            ) : null;
          })}
          <li style={{ cursor: "pointer" }}>
            <Link
              activeClass="active"
              smooth={true}
              spy={true}
              to={drinks ? "" : categories[1]?.cname}
              offset={-50}
              duration={3000}
              onClick={onDrinksClick}
            >
              Drinks<span>({categories[1]?.sub_category.length})</span>{" "}
              <ChevronRightIcon fontSize="small" style={{ float: "right" }} />
            </Link>
          </li>
          {categories.map((category, i) => {
            return category.cname === "Drinks" && drinks ? (
              <MenuSubCategory
                list={category.sub_category}
                searchQuery={menu.searchQuery}
                selectedCategoryId={menu.selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                drinkstatus={drinkstatus}
                hide={() => hideCategory()}
              />
            ) : null;
          })}
          {isPizzaAvailable ? (
            <li key="pizza" style={{ cursor: "pointer" }}>
              <Link
                activeClass="active"
                smooth={true}
                spy={true}
                to="Pizza"
                duration={4000}
                offset={-70}
                onClick={() => {
                  drinkstatus(true);
                  dispatch(displayPizzas());
                }}
              >
                Pizza's <span> ({isPizzaAvailable}) </span>{" "}
                <ChevronRightIcon fontSize="small" style={{ float: "right" }} />
              </Link>
            </li>
          ) : null}

          {menu.isHappyHoursApplicable && isHappyHoursActive ? (
            <li key="happyHours" style={{ cursor: "pointer" }}>
              <Link
                activeClass="active"
                smooth={true}
                spy={true}
                to="Happy Hours"
                offset={-50}
                duration={4000}
                onClick={() => {
                  drinkstatus(false);
                  dispatch(displayHappyHours());
                }}
              >
                Happy hours <span> ({menu?.happyHours?.length}) </span>
                <ChevronRightIcon fontSize="small" style={{ float: "right" }} />
              </Link>
            </li>
          ) : null}
        </ul>
      </div>

      {/* section of mobile start */}

      <SimpleBarReact
        autoHide={true}
        className={`${displayCategoryInMobile} menu-categories-container`}
      >
        {/* <div style={{ display: "flex", flexDirection: "column" }}> */}
        {/* <nav className="categories-container"> */}
        {menu.isHappyHoursApplicable && isHappyHoursActive ? (
          <>
            <li
              style={{
                cursor: "pointer",
                listStyleType: "none",
                marginTop: "10px",
              }}
            >
              <Link
                activeClass="active"
                smooth={true}
                spy={true}
                //to="Kebabs"
                //to={dishes ? "" : categories[0]?.cname}
                offset={0}
                onClick={onDishClick}
              >
                Dishes <span>({categories[0]?.sub_category.length})</span>
                <ChevronRightIcon
                  fontSize="small"
                  style={{ float: "right" }}
                />{" "}
              </Link>
            </li>
            {categories.map((category, i) => {
              return category.cname === "Dishes" && dishes ? (
                <MenuSubCategory
                  list={category.sub_category}
                  searchQuery={menu.searchQuery}
                  selectedCategoryId={menu.selectedCategoryId}
                  setSelectedCategoryId={setSelectedCategoryId}
                  drinkstatus={drinkstatus}
                  hide={() => hideCategory()}
                />
              ) : null;
            })}

            <li
              style={{
                cursor: "pointer",
                listStyleType: "none",
                marginTop: "10px",
              }}
            >
              <Link
                activeClass="active"
                smooth={true}
                spy={true}
                to={drinks ? "" : categories[1]?.cname}
                offset={-50}
                duration={3000}
                onClick={onDrinksClick}
              >
                Drinks<span>({categories[1]?.sub_category.length})</span>{" "}
                <ChevronRightIcon fontSize="small" style={{ float: "right" }} />
              </Link>
            </li>
            {categories.map((category, i) => {
              return category.cname === "Drinks" && drinks ? (
                <MenuSubCategory
                  list={category.sub_category}
                  searchQuery={menu.searchQuery}
                  selectedCategoryId={menu.selectedCategoryId}
                  setSelectedCategoryId={setSelectedCategoryId}
                  drinkstatus={drinkstatus}
                  hide={() => hideCategory()}
                  // hideCategoryList={() => hideCategory()}
                />
              ) : null;
            })}
          </>
        ) : null}
        {isPizzaAvailable ? (
          <li
            key="pizza"
            style={{
              cursor: "pointer",
              listStyleType: "none",
              marginTop: "10px",
            }}
          >
            <Link
              activeClass="active"
              smooth={true}
              spy={true}
              to="Pizza"
              duration={4000}
              offset={-70}
              onClick={() => {
                drinkstatus(true);
                dispatch(displayPizzas());
                hideCategory();
              }}
            >
              Pizza's <span> ({isPizzaAvailable}) </span>{" "}
              <ChevronRightIcon fontSize="small" style={{ float: "right" }} />
            </Link>
          </li>
        ) : null}

        {menu.isHappyHoursApplicable && isHappyHoursActive ? (
          <li
            key="happyHours"
            style={{ cursor: "pointer", listStyle: "none", marginTop: "10px" }}
          >
            <Link
              activeClass="active"
              smooth={true}
              spy={true}
              to="Happy Hours"
              offset={-50}
              duration={4000}
              onClick={() => {
                drinkstatus(false);
                dispatch(displayHappyHours());
              }}
            >
              Happy hours <span> ({menu?.happyHours?.length}) </span>
              <ChevronRightIcon fontSize="small" style={{ float: "right" }} />
            </Link>
          </li>
        ) : null}
        {/* </nav> */}
        {/* </div> */}
      </SimpleBarReact>

      {/* section of mobile end */}

      {!displayHideCategory ? (
        <section className="mobile-menu-categories" id="id-of-menu">
          <span onClick={showCategoryMobile} className="categories-button">
            <RestaurantIcon style={{ marginTop: "-5px" }} fontSize="small" />{" "}
            MENU
          </span>
        </section>
      ) : null}
      {displayHideCategory ? (
        <section className="mobile-menu-categories" id="id-of-menu">
          <span onClick={hideCategoryMobile} className="categories-button">
            <CloseIcon style={{ marginTop: "-5px" }} /> Close
          </span>
        </section>
      ) : null}
    </>
  );
});

const MenuSubCategory = React.memo(
  ({
    list,
    searchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    drinkstatus,
    hide,
  }) => {
    const menu = useSelector((state) => state.menu);
    const isSelectedCategory = (categoryId, index) => {
      if (menu.selectedCategoryId) {
        return categoryId === menu.selectedCategoryId;
      }

      return menu.searchQuery.trim().length > 0 ? false : index === 0;
    };
    console.log("list in menucategories is", list);
    const dispatch = useDispatch();
    const handleClick = (e, item) => {
      drinkstatus(true);
      // console.log("lis of sub cat", temp_cat);
      // e.stopPropagation();

      dispatch(setSelectedCategoryId(item.category_id));
      hide();

      console.log("items is", item);
    };
    return list.map((s_category, i) => {
      //drinkstatus(true);
      console.log("s_category", s_category);

      return (
        <Link
          activeClass="active"
          to={s_category.cname}
          spy={true}
          smooth={true}
          offset={-70}
          duration={4000}
          onClick={(e) => {
            handleClick(e, s_category);
          }}
        >
          <li
            key={s_category.category_id}
            style={{ cursor: "pointer" }}
            className={`category ${
              isSelectedCategory(s_category.category_id, i)
                ? "selected_cat_id"
                : ""
            }`}

            // onClick={(e) => handleClick(e, s_category)}
          >
            <a id="subcategory_id">
              {s_category?.cname}{" "}
              <ChevronRightIcon
                fontSize="small"
                className="hide-on-mobile"
                style={{ float: "right" }}
              />
            </a>
          </li>
        </Link>
      );
    });
  }
);

export default MenuCategories;
