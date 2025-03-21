import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import RenderDemo from "./RenderDemo";
import RenderPropsDemo from "./RenderPropsDemo/RenderPropsDemo";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <RenderDemo /> */}
      <RenderPropsDemo/>
    </>
  );
}

export default App;
