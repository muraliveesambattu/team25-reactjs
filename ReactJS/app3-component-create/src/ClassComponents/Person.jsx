import { Component } from "react";
import PersonDetails from "./PersonDetails";

export default class Person extends Component {
  constructor() {
    super();
    this.state = {
      myName: "Murali ",
      desription:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam repudiandae pariatur unde expedita! A, ex commodi exercitationem eaque perferendis consequuntur qui sequi tempore, quasi ut et assumenda quod accusantium praesentium!  ",
      imgAddress:
        "https://media.istockphoto.com/id/1550071750/photo/green-tea-tree-leaves-camellia-sinensis-in-organic-farm-sunlight-fresh-young-tender-bud.jpg?s=612x612&w=0&k=20&c=RC_xD5DY5qPH_hpqeOY1g1pM6bJgGJSssWYjVIvvoLw=",
      email: "murali@gmail.com",
      address: {
        fullName:"Rama Krishna"
      },
      stuents: ["Ram","Sam","Sai","Kumar"],
    };
  }
  render() {
    return (
      <div>
       <PersonDetails allDetails = {this.state}/>
      </div>
    );
  }
}


export class NewPerson extends Component{
    render(){
        return <h2>Welcome from NewPerson Component </h2>
    }
}

