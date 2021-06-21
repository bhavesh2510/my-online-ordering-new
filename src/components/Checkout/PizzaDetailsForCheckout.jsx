import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../state-management/modal/actions";

const PizzaDetailsForChekout = (item) => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);
  function renderPizzaDetails(item) {
    let defaultToppings = "";

    let optionalToppings = "";

    let halfAndHalf = "";

    for (let i = 0; i < item.defaultToppings.length; i++) {
      defaultToppings += `, ${item.defaultToppings[i].topping_name}`;
    }
    defaultToppings = defaultToppings.replace(/[\s,]+/, " ").trim();

    for (let i = 0; i < item.optionalToppings.length; i++) {
      optionalToppings += ` ,${item.optionalToppings[i].topping_name}`;
    }
    optionalToppings = optionalToppings.replace(/[\s,]+/, " ").trim();

    if (item.firstHalf !== null) {
      halfAndHalf = `First Half: ${item.firstHalf.topping_name},`;
      halfAndHalf += ` Second Half: ${item.secondHalf.topping_name}`;
    }

    return (
      <>
        <section
          className="size-and-base-section"
          style={{ marginTop: "10px" }}
        >
          <label style={{ fontSize: "17px" }}>
            Size & Base:&nbsp;
            <span className="text-pizzamodal"> {item.selectedBase.name} </span>
          </label>
        </section>
        <br />
        <section className="toppings-list">
          {defaultToppings !== "" ? (
            <label style={{ fontSize: "17px" }}>
              Default Toppings:&nbsp; &nbsp;{" "}
            </label>
          ) : null}
          <span className="text-pizzamodal" style={{ fontSize: "14px" }}>
            {defaultToppings}
          </span>
          <br />
          <br />
          {optionalToppings !== "" ? (
            <label style={{ fontSize: "17px" }}>
              Optional Toppings: &nbsp; &nbsp;
            </label>
          ) : null}
          <span className="text-pizzamodal" style={{ fontSize: "14px" }}>
            {optionalToppings}
          </span>
        </section>
        <br />
        <section className="toppings-list">
          {halfAndHalf !== "" ? (
            <label style={{ fontSize: "17px" }}>
              Half And Half Choice:&nbsp; &nbsp;{" "}
            </label>
          ) : null}
          <span className="text-pizzamodal" style={{ fontSize: "14px" }}>
            {halfAndHalf}
          </span>
        </section>
      </>
    );
  }

  const toggle = () => {
    dispatch(closeModal());
  };
  return (
    <>
      <Modal isOpen={true} toggle={toggle} style={{ top: "20%", left: "2%" }}>
        <ModalHeader toggle={toggle}>{modal.modal.state.item.name}</ModalHeader>
        <ModalBody>{renderPizzaDetails(modal.modal.state.item)}</ModalBody>
      </Modal>
    </>
  );
};
export default PizzaDetailsForChekout;
