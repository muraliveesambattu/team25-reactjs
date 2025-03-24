import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ClickCounterDemo from "./Components/ClickCounterDemo";
import HoverCounterDemo from "./Components/HoverCounterDemo";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ClickCounterDemo />
      <hr />
      <HoverCounterDemo />
    </>
  );
}

export default App;
