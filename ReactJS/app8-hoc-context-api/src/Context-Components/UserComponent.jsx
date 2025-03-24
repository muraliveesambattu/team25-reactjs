import React, { Component } from "react";
import { UserContextConsumber } from "./ContextDemo";

export default class UserComponent extends Component {
  render() {
    return (
      <div>
        <h2>Welcome to User Component !!</h2>
        <h2>Message from Main is : {this.props.message}</h2>
        <UserContextConsumber>
          {(value) => {
            return <h2>{value}</h2>;
          }}
        </UserContextConsumber>
      </div>
    );
  }
}
