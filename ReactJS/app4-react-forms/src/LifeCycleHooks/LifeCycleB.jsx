import { Component } from "react";

export default class LifeCycleB extends Component {
  constructor(props) {
    super();
    this.state = {};
    console.log("LifeCycleB constructor Called !!!");
  }

  static getDerivedStateFromProps() {
    console.log("LifeCycleB getDerivedStateFromProps Called !!!");

    return {};
  }
  shouldComponentUpdate() {
    console.log("LifeCycleB shouldComponentUpdate Called !!!");
    return true;
  }
  render() {
    console.log("LifeCycleB render Called !!!");

    return <h2>{this.props.countValue}</h2>;
  }
  getSnapshotBeforeUpdate() {
    console.log("LifeCycleB getSnapshotBeforeUpdate Called !!!");
  }

  componentDidUpdate() {
    console.log("LifeCycleB componentDidUpdate Called !!!");
  }
}
