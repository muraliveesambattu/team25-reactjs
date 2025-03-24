import React from "react";
import { Component } from "react";

const HOCDemo = (ClickCounterDemo) => {
  class NewComnnent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        count: 0,
      };
    }
    handleIncrement = () => {
      this.setState({ count: this.state.count + 1 });
    };
    handleDecrement = () => {
      this.setState({ count: this.state.count - 1 });
    };
    handleReset = () => {
      this.setState({ count: 0 });
    };

    render() {
      const { handleIncrement, handleDecrement, handleReset } = this;
      return (
        <ClickCounterDemo
          count={this.state.count}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
          handleReset={handleReset}
        />
      );
    }
  }

  return NewComnnent;
};

export default HOCDemo;
