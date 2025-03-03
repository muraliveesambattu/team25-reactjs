import logo from "./logo.svg";
import "./App.css";
import Murali from "./ClassComponents/MuraliClass";
import Jaga from "./ClassComponents/JagaClass";
import Yamuna from "./ClassComponents/YamunaClass";
import Bhavya from "./Bhavya";
import Person, { NewPerson } from "./ClassComponents/Person";

function App() {
  return (
    <div className="App">
      {/* <Murali />
      <hr />
      <Jaga />
      <hr />
      <Yamuna /> */}
      {/* <Bhavya/> */}
      <Person />
      {/* <NewPerson /> */}
    </div>
  );
}

export default App;
