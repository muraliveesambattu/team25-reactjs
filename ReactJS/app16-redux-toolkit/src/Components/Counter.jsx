import React, { Component } from "react";
import { connect } from "react-redux";
import { decrement, increment, reset } from "../store/counterSlice";

class Counter extends Component {
  handleIncrement = () => {
    this.props.dispatch(increment());
  };
  handleDecrement = () => {
    this.props.dispatch(decrement());
  };
  handleReset = () => {
    this.props.dispatch(reset());
  };

  render() {
    console.log(this.props);
    const { count } = this.props.counter;
    return (
      <div>
        <h2>Welcome to Counter Component !</h2>
        <h2>Count is : {count}</h2>
        <button onClick={this.handleIncrement}>Increment</button>
        <button onClick={this.handleDecrement}>Decrement</button>
        <button onClick={this.handleReset}>Reset</button>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(Counter);
