import React, { useState } from "react";

const FuncHoverCouter = ({
  count,
  handleIncrement,
  handleDecrement,
  handleReset,
}) => {
  return (
    <div>
      <button onMouseOver={handleIncrement}>Increment</button>
      <button onMouseOver={handleDecrement}>Decrement</button>
      <button onMouseOver={handleReset}>Reset</button>
      <h2>{count}</h2>
    </div>
  );
};

export default FuncHoverCouter;
