import "../WaitingOverlay/WaitingOverlay.css";
const WaitingOverlay = () => {
  return (
    <>
      <div className='loading'>Loading&#8230;</div>

      <div className='content'>
        <h3>stuff goes in here!</h3>
      </div>
    </>
  );
};
export default WaitingOverlay;

// <div className="waiting-overlay">
//   <div class="lds-ring">
//     <div></div>
//     <div></div>
//     <div></div>
//     <div></div>
//   </div>
// </div>
