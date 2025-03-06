import logo from "./logo.svg";
import "./App.css";
import Murali from "./ClassComponents/MuraliClass";
import Jaga from "./ClassComponents/JagaClass";
import Yamuna from "./ClassComponents/YamunaClass";
import Bhavya from "./Bhavya";
import Person, { NewPerson } from "./ClassComponents/Person";
import { Student } from "./ClassComponents/Student";
import { ParentUser } from "./ClassComponents/ParentUser";
import { BhavyaClassComp } from "./ClassComponents/Bhavya";
import Jagadeesh from "./ClassComponents/Jagadeesh";

function App() {
  return (
    <div className="App">
        {/* <Student/> */}
        {/* <ParentUser/> */}
        {/* <BhavyaClassComp/> */}
        <Jagadeesh/>
    </div>
  );
}

export default App;
