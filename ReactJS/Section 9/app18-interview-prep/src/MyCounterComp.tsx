import React, { useReducer } from "react";

const countReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;

    case "DECREMENT":
      return state - 1;

    case "RESETCOUNT":
      return 0;
    default:
      return state;
  }
};
const MyCounterComp = () => {
  const [val, dispatch] = useReducer(countReducer, 0);
  console.log(val)
  return <div>
    value : {val} <br />
    <button onClick={() => dispatch({ type: "INCREMENT" })}>Increment</button>
    <button onClick={() => dispatch({ type: "DECREMENT" })}>Decrement</button>
    <button onClick={() => dispatch({ type: "RESETCOUNT" })}>Reset</button>
  </div>;
};

export default MyCounterComp;
