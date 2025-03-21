import React, { Component } from "react";
import UserComp from "./UserComp";
import Welcome from "./Welcome";

export default class RenderDemo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 10,
    };
  }

  handleInfo = () => {
    this.setState({ value: this.state.value + 10 });
  };

  render = () => {
    // return <h2>Hello I am From Parent Component </h2>;
    return (
      <>
        <Welcome studentName="Jaga" />
        <Welcome studentName="Bhavya" />
        <Welcome studentName="Yamuna" />
      </>
    );
  };
  render() {
    return (
      <div>
        <h2>Welcome to Render Demo Component !!!</h2>
        <p>{this.state.value}</p>
        <hr />
        <UserComp
          handleInfo={this.handleInfo}
          showWelcomeMessage={this.render}
        />
      </div>
    );
  }
}
