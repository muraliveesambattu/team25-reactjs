import React, { Component } from "react";

export default class HoverCounter extends Component {

  render() {
    return (
      <div>
        <h2>{this.props.count}</h2>
        <button onMouseOver={this.props.handleIncrement}>Increment Count</button>
        <button onMouseOver={this.props.handleDecrement}>Decrement Count</button>
        <button onMouseOver={this.props.handleReset}>Reset Count</button>
      </div>
    );
  }
}
