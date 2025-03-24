import React, { Component } from "react";
import ParentComponent from "./ParentComponent";
import { UserContextProvider } from "./ContextDemo";

export default class MainComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "Welcome to Props Drill Down !!!",
      info: "I am from Context API",
    };
  }

  render() {
    return (
      <div>
        <h2>Welcome to Main Component !!</h2>
        <hr />
        <UserContextProvider value={this.state.info}>
          <ParentComponent message={this.state.message} />
        </UserContextProvider>
      </div>
    );
  }
}
