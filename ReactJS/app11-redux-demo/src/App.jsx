import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Users from "./Components/Users";
import Employees from "./Components/Employees";
import Students from "./Components/Students";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Users />
      <hr />
      <Employees />
      <hr />
      <Students />
    </>
  );
}

export default App;
