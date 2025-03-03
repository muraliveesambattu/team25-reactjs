import { Component } from "react";

export class Student extends Component {
  constructor() {
    super();
    this.state = {
      fname: "Murali",
      email:"murali@gmail.com"
    };
  }

  changeFirstName = () => {
    // console.log("changeFirstName Called !!!")
    // this.state.fname = "Ram Krishna !!!";
    this.setState({fname:"Ram Krishna !!!"})
  };

  changeEmail =()=>{
    this.setState({email:"ram@gmail.com"});
  }
  render() {
    return (
      <div>
        <h2>Welcome To Studnet Componemt !!!</h2>
        <button onClick={this.changeFirstName}>Change First Name</button>
        <h3>{this.state.fname}</h3>
        <hr />
        <button onClick={this.changeEmail}>Change Email</button>
        <h2>{this.state.email}</h2>
      </div>
    );
  }
}
