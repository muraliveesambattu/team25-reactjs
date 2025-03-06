import { Component } from "react";
import ChildUsers from "./ChildUsers";
import './myStyles.css'
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
        <h2 style={{background:"red",color:'white'}}>Welcome to Parent User</h2>
        <button onClick={this.handleObjectChange} className="myObject">Change Object Details</button>
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
