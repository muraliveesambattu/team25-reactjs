import React, { Component } from "react";
import ClickCounter from "./ClickCounter";
import HoverCounter from "./HoverCounter";
import HandleCounter from "./HandleCounter";

export default class RenderPropsDemo extends Component {
  render() {
    return (
      <div>
        <h2>Welcome to Render Props Demo !!!!</h2>

        <HandleCounter
          render={(count, handleIncrement, handleDecrement, handleReset) => (
            <ClickCounter
              count={count}
              handleIncrement={handleIncrement}
              handleDecrement={handleDecrement}
              handleReset={handleReset}
            />
          )}
        />
        <HandleCounter
          render={(count, handleIncrement, handleDecrement, handleReset) => (
            <HoverCounter
              count={count}
              handleIncrement={handleIncrement}
              handleDecrement={handleDecrement}
              handleReset={handleReset}
            />
          )}
        />
      </div>
    );
  }
}
