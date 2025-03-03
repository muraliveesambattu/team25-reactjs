import { Component } from "react";

export default class ChildUsers extends Component {
  render() {
    return (
      <ul>
        {this.props.allUsers.map(function (usr,i) {
          return <li key={i}>{usr}</li>;
        })}
      </ul>
    );
  }
}
