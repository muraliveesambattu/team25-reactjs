import React, { Component } from "react";
import HOCDemo from "./HOCDemo";

class HoverCounterDemo extends Component {
  render() {
    const { count, handleIncrement, handleDecrement, handleReset } = this.props;
    return (
      <>
        <h2>The Count : {count}</h2>
        <button onMouseOver={handleIncrement}>Increment Count</button>
        <button onMouseOver={handleDecrement}>Decrement Count</button>
        <button onMouseOver={handleReset}>Reset Count</button>
      </>
    );
  }
}
export default HOCDemo(HoverCounterDemo);
