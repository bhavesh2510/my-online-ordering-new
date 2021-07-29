import React, { useState, useEffect } from "react";

import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";

import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import LocationOnIcon from "@material-ui/icons/LocationOn";

const InfoSlider = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [imgurl, setimgurl] = useState([]);
  const menu = useSelector((state) => state.menu);

  useEffect(() => {
    axios
      .get(
        `https://ciboapp.com/api/mobileApi/v2/gallery/getGalleryImages/restId/${menu.restaurantInfo.restaurant_id}`
      )
      .then((res) => {
        console.log("response of gallery is", res);
        setimgurl(res.data.data);
      });
  }, []);

  useEffect(() => {
    console.log("imgurl  is", imgurl);
  }, [imgurl]);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === imgurl.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? imgurl.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = imgurl.map((item) => {
    console.log("item image is", item.image);
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.image}
      >
        <section
          className="parallax-window"
          data-parallax="scroll"
          style={{
            background: `url(${item.image}) no-repeat center`,
            backgroundSize: "cover",
          }}
          data-natural-width={1400}
          data-natural-height={170}
        >
          <div id="subheader">
            <div id="sub_content">
              {/* <h1>{menu.restaurantInfo.rname}</h1> */}
              <div>{/* <em>{menu.restaurantInfo.description}</em> */}</div>
              <div>
                {/* <LocationOnIcon />{" "}
                {`${menu.restaurantInfo.address} - ${menu.restaurantInfo.city} - ${menu.restaurantInfo.country}- ${menu.restaurantInfo.zipcode}`}{" "}
                <br />
                {menu.restaurantInfo.cost.free_delivery_eligible_amount > 0 ? (
                  <>
                    <strong>Delivery charge:</strong> free over&nbsp;
                    {menu.restaurantInfo.cost.free_delivery_eligible_amount}
                    &nbsp;
                    {menu.restaurantInfo?.monetary_symbol}
                    <br />
                  </>
                ) : null}
                Delivery Options : &nbsp;
                {menu.restaurantInfo.order_option
                  ?.split(",")
                  .map((option, i) => {
                    return (
                      <b style={{ textTransform: "capitalize" }}>
                        {option}
                        <CheckCircleOutlineIcon /> &nbsp;
                      </b>
                    );
                  })} */}
              </div>
            </div>
          </div>
        </section>
      </CarouselItem>
    );
  });

  return (
    <Carousel
      style={{ height: "400px" }}
      activeIndex={activeIndex}
      next={next}
      previous={previous}
    >
      {/* <CarouselIndicators
        items={imgurl}
        activeIndex={activeIndex}
        onClickHandler={goToIndex}
      /> */}
      {slides}
      <CarouselControl
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
  );
};

export default InfoSlider;
