import React, { Component } from "react";

export default class ClickCounter extends Component {

  render() {
    console.log(this.props)
    return (
      <div>
        <h2>{this.props.count}</h2>
        <button onClick={this.props.handleIncrement}>Increment Count</button>
        <button onClick={this.props.handleDecrement}>Decrement Count</button>
        <button onClick={this.props.handleReset}>Reset Count</button>
      </div>
    );
  }
}
