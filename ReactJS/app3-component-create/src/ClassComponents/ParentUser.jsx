import { Component } from "react";
import ChildUsers from "./ChildUsers";

export class ParentUser extends Component {
  constructor() {
    super();
    this.state = {
      person: {
        fname: "Ram",
        lname: "krishna",
        email: "ram@gmail.com",
      },
      users:["Ram","Krishna","Sam","Sundar","Ravi"]
    };
  }

  handleObjectChange = () => {
    this.setState({
      person: {
        fname: "Kiran",
        lname: "Kumar",
        email: "kiran@gmail.com",
      },
    });
  };
  render() {
    return (
      <div>
        <h2>Welcome to Parent User</h2>
        <button onClick={this.handleObjectChange}>Change Object Details</button>
        <ul>
          <li>{this.state.person.fname}</li>
          <li>{this.state.person.lname}</li>
          <li>{this.state.person.email}</li>
        </ul>

        <hr />

        <ChildUsers allUsers={this.state.users}/>
      </div>
    );
  }
}
