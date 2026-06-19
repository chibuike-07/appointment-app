// import Header from "./components/Header";
import Home from "./pages/Home";
import ReminderNotification from "./components/ReminderNotification";

const App = () => {
  return (
    <div>
      {/* <div className="navbar">

      </div> */}
      <ReminderNotification />
      <Home />
    </div>
  );
}

export default App;