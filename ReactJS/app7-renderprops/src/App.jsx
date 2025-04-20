import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import RenderDemo from "./RenderDemo";
import RenderPropsDemo from "./RenderPropsDemo/RenderPropsDemo";
import FuncHoverCouter from "./FuncComponents/FuncHoverCouter";
import FuncClickCounter from "./FuncComponents/FuncClickCounter";
import FuncRenderPropsDemo from "./FuncComponents/FuncRenderPropsDemo";

const NewComponent = () => {
  return <h2>New Component Messagre </h2>;
};
function App() {
  const [count, setCount] = useState(0);

  const handleClickFunc = () => {
    return <NewComponent />;
  };
  return (
    <>
      {/* <RenderDemo /> */}
      {/* <RenderPropsDemo/> */}
      {/* <FuncHoverCouter/> 
      <hr />
      <FuncClickCounter/> */}

      <FuncRenderPropsDemo
        render={(count, handleIncrement, handleDecrement, handleReset) => (
          <FuncHoverCouter
            count={count}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
            handleReset={handleReset}
          />
        )}
      />
      <FuncRenderPropsDemo
        render={(count, handleIncrement, handleDecrement, handleReset) => (
          <FuncClickCounter
            count={count}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
            handleReset={handleReset}
          />
        )}
      />
    </>
  );
}

export default App;
