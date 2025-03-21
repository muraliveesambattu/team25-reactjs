import React, { Component } from "react";

export default class HandleCounter extends Component {
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
    console.log(this.props);
    return (
      <div>
        {this.props.render(
          this.state.count,
          this.handleIncrement,
          this.handleDecrement,
          this.handleReset
        )}
      </div>
    );
  }
}
