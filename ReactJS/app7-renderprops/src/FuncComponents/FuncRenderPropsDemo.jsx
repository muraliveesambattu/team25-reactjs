import React, { useState } from "react";

const FuncRenderPropsDemo = ({ render }) => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };
  const handleDecrement = () => {
    setCount(count - 1);
  };
  const handleReset = () => {
    setCount(0);
  };

  return <div>{render(count,handleIncrement,handleDecrement,handleReset)}</div>;
};

export default FuncRenderPropsDemo;
