import React, { Component } from "react";
import HOCDemo from "./HOCDemo";

class ClickCounterDemo extends Component {
  render() {
    const { count, handleIncrement, handleDecrement, handleReset } = this.props;
    return (
      <>
        <h2>The Count : {count}</h2>
        <button onClick={handleIncrement}>Increment Count</button>
        <button onClick={handleDecrement}>Decrement Count</button>
        <button onClick={handleReset}>Reset Count</button>
      </>
    );
  }
}

export default HOCDemo(ClickCounterDemo);
