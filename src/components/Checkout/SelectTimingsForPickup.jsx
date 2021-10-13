import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { TimePicker } from "antd";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { setPickupTime } from "../../state-management/user/actions";

const SelectTimingsForPickup = (props) => {
  const main = useSelector((state) => state.main);
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);
  const [show, setshow] = useState(false);
  const dispatch = useDispatch();
  const [disabletime, setdisabletime] = useState(false);
  const settime = () => {
    var moment = require("moment-timezone");

    var o = moment(`${main.opening}`, "HH:mm");
    var c = moment(main.closing, "HH:mm");
    // var local_time = moment
    //   .tz(moment(), `${menu.restaurantInfo.timezone}`)

    //   .format("HH:mm");
    var local_time = moment
      .tz(moment(), `${menu.restaurantInfo.timezone}`)

      .format("HH:mm");

    var x = moment(local_time, "HH:mm");
    var diff = Math.abs(c.diff(x, "minutes"));
    console.log("diff is", Math.abs(diff));
    return moment
      .tz(moment(), `${menu.restaurantInfo.timezone}`)
      .add(30, "minutes")
      .format("HH:mm") >= main.opening &&
      moment
        .tz(moment(), `${menu.restaurantInfo.timezone}`)
        .add(30, "minutes")
        .format("HH:mm") <= main.closing
      ? moment
          .tz(moment(), `${menu.restaurantInfo.timezone}`)
          .add(30, "minutes")
      : diff > 30
      ? moment(main.opening, "HH:mm")
      : moment(main.closing, "HH:mm");
    // moment(main.opening, "HH:mm");
  };
  let x = JSON.parse(window.localStorage.getItem("ptime"));
  const [data, setdata] = useState({
    openingBusinesHours: main.opening,
    closingBusinesHours: main.closing,
    businessHours: main.businessHour,

    pickupTime: x ? moment(x, "HH:mm") : settime(),
    deliveryTime: settime(),
  });

  useEffect(() => {
    console.log("diabletime is", disabletime);
  }, [disabletime]);
  const getMinHours = () => {
    const businessHoursFrom = parseInt(
      data.businessHours.split("-")[0].split(":")[0]
    );

    const minHours = [];
    for (let i = 0; i < businessHoursFrom; i++) {
      minHours.push(i);
    }
    // console.log(minHours);
    return minHours;
  };

  useEffect(() => {
    var formatted = moment(data.pickupTime, "HH:mm").format("HH:mm");
    props.getpickuptime(formatted);
    var x1 = settime();
    var fx1 = moment(x1, "Hh:mm").format("HH:mm");
    var y1 = main.closing;
    console.log("x1y1 are", fx1, y1);
    if (fx1 == y1) {
      setdisabletime(true);
    }
  }, []);

  // ? Get the businesss hours end from businessHours props
  const getMaxHours = () => {
    const businessHoursTo = parseInt(
      data.businessHours.split("-")[1].split(":")[0]
    );
    const maxHours = [];
    if (Number(data.businessHours.split("-")[1].split(":")[1] > 0)) {
      for (let i = businessHoursTo + 1; i < 24; i++) {
        maxHours.push(i);
      }
    } else {
      for (let i = businessHoursTo; i < 24; i++) {
        maxHours.push(i);
      }
      // console.log( Number((this.state.businessHours.split("-")[1].split(":")[1]) <0))
    }

    // console.log(this.state.businessHours.split("-")[1].split(":")[1]);
    return maxHours;
  };
  const getDisabledHours = () => {
    let hours = [...getMinHours(), ...getMaxHours()]; //? restricting business hours in timer, so no need for seperate validation for pickup time
    if (moment().minute() > 30) {
      for (
        let i = 0;
        i <
        moment
          .tz(moment(), `${menu.restaurantInfo.timezone}`)

          .hour() +
          1;
        i++
      ) {
        hours.push(i);
      }
    }

    for (
      let i = 0;
      i <
      moment
        .tz(moment(), `${menu.restaurantInfo.timezone}`)

        .hour();
      i++
    ) {
      hours.push(i);
    }
    // console.log(hours);
    return hours;
  };
  const onPickupTimeChange = (time, timeString) => {
    // if (!data.businessHours) {
    //   setdata({ ...data, pickupTime: null });

    //   return false;
    // }
    // we are moving in circles here, we have separate opening and closing object, this is unnecessary code.
    const selectedTime = moment(time, "HH:mm").format("HH:mm");
    var businessHoursFrom = moment(data.openingBusinesHours, "HH:mm").format(
      "HH:mm"
    );
    var businessHoursTo = moment(data.closingBusinesHours, "HH:mm").format(
      "HH:mm"
    );

    console.log("selected time", timeString);
    // const businessHoursFromTo = data.businessHours.split(" - ");
    // const businessHoursFrom = moment(businessHoursFromTo[0], "HH:mm");
    // const businessHoursTo = moment(businessHoursFromTo[1], "HH:mm");

    console.log("from", businessHoursFrom);
    console.log("To", businessHoursTo);
    var local_after = moment
      .tz(moment(), `${menu.restaurantInfo.timezone}`)
      .add(30, "minutes")

      .format("HH:mm");

    console.log("after is", local_after);

    if (timeString < local_after) {
      console.log("1 level");
      var formatted = moment(data.pickupTime, "HH:mm").format("hh:mm A");

      notification["warning"]({
        message: `Please select time more than or equal to ${formatted}`,
        style: {
          marginTop: "50px",

          color: "rgba(0, 0, 0, 0.65)",
          border: "1px solid #b7eb8f",
          backgroundColor: "#f6ffed",
        },
        placement: "topLeft",
      });
    } else if (timeString > main.opening && timeString < main.closing) {
      localStorage.setItem("ptime", JSON.stringify(timeString));
      setdata({ ...data, pickupTime: selectedTime });
      props.getpickuptime(timeString);
      dispatch(setPickupTime(timeString));
      notification["success"]({
        message: "Time changed Successfully",
        style: {
          marginTop: "50px",

          color: "rgba(0, 0, 0, 0.65)",
          border: "1px solid #b7eb8f",
          backgroundColor: "#f6ffed",
        },
        placement: "topLeft",
      });
    } else {
      setdata({ ...data, pickupTime: null });
      notification["warning"]({
        message: "Sorry, Please select time between business hours",
        style: {
          marginTop: "50px",

          color: "rgba(0, 0, 0, 0.65)",
          border: "1px solid #b7eb8f",
          backgroundColor: "#f6ffed",
        },
        placement: "topLeft",
      });
    }
  };
  const showAddressModal = () => {
    setshow(true);
  };

  return (
    <>
      <div
        className='box_style_2'
        style={{ cursor: "pointer", marginTop: "-20px" }}
        onClick={showAddressModal}
      >
        <h2 className='delivery-head'>Pickup Details</h2>
        <div className='pickup-details'>
          <h3>
            <strong className='delivery-head-business'>
              Business hours : {main.businessHour}
            </strong>
          </h3>
          <br />
          <div
            className='address-details'
            style={{
              color: "black",
              fontWeight: "600",
            }}
          >
            Selected Pickup Time : &nbsp;
            <div className='timepicker-container'>
              <TimePicker
                defaultValue={data.pickupTime}
                disabledHours={getDisabledHours}
                onChange={onPickupTimeChange}
                format='HH:mm'
                disabled={disabletime}
              />
            </div>
          </div>
        </div>
      </div>
      {disabletime ? (
        <p
          style={{
            color: "#968ea1",
            fontWeight: "700",
            fontSize: "13px",
            marginTop: "-45px",
            marginLeft: "25px",
            marginBottom: "30px",
          }}
        >
          you cannot change time as we are closing soon!
        </p>
      ) : null}
    </>
  );
};
export default SelectTimingsForPickup;
