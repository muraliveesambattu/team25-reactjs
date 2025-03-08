import { Component } from "react";
import LifeCycleB from "./LifeCycleB";
import MyImgComp from "./MyImgComp";
export class LifeCylceA extends Component {
  static getDerivedStateFromProps(props, state) {
    console.log("LifeCylceA getDerivedStateFromProps !!!");
    return null;
  }

  componentDidMount() {
    console.log("Yes componentDidMount Loading is Completed !!!!");
  }

  constructor(props) {
    super();
    console.log("Hello I am from Consutructor !!! ");
    this.state = {
      count: 10,
    };
  }

  changeCount = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    console.log("LifeCylceA Render method also is called !!! ");
    return (
      <div>
        <h2>Welcome to Life Cycle Hooks </h2>
        <button onClick={this.changeCount}>Change Count</button>
        <LifeCycleB countValue={this.state.count} />

        {this.state.count === 10 && <MyImgComp/>}
        {/* <LIfeCycleB countValue = {this.state.count}/> */}
      </div>
    );
  }
}
