import SampleComp from "./Components/SampleComp";
import UserForm from "./Components/UserForm";
import logo from "./logo.svg";
import Murali from "./Murali";

function App() {
  function handleIncrement(){}
  return (
    <div className="App">
      <Murali
        message="How Are you ?"
        student="Ram"
        user="Ravi"
        employee="Kiran"
        handleIncrement={handleIncrement}
        users={["ABC","KIRAN"]}
      />
      {/* <SampleComp/> */}
      {/* <UserForm/> */}
    </div>
  );
}

export default App;
