import React, { Component } from "react";

export default class SampleComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      person: {
        fname: "Ram",
      },
      users: [{ fname: "Ram" }, { fname: "Sam" }],
    };
  }

  handleIncrement = () => {};
  handleDecrement = () => {};
  handleReset = () => {};

  render() {
    return (
      <div>
        <h2>{this.state.count}</h2>
        <ul>
          <li>{this.state.person.fname}</li>
        </ul>

        <ul>
          {this.state.users.map((obj)=>{
            return <li>{obj.fname}</li>
          })}
        </ul>
      </div>
    );
  }
}
