import "../WaitingOverlay/WaitingOverlay.css";
const WaitingOverlay = () => {
  return (
    <div className="waiting-overlay">
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
export default WaitingOverlay;
