import RestaurantList from "./containers/RestaurantList/RestaurantList";
import {BrowserRouter as Router} from 'react-router-dom'
import Appheader from "./components/AppHeader/AppHeader";
import Footer from "./components/Footer/Footer";
function App() {
  return (
    <div className="App">
      <Router>
        <Appheader />
        <RestaurantList />
        <Footer />
      </Router>
    </div>
  );
}

export default App;
