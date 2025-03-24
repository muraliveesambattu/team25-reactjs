import React, { Component } from 'react'
import ChildComponent from './ChildComponent'

export default class ParentComponent extends Component {
  render() {
    return (
      <div>
        <h2>Welcome to Parent Component </h2>
        <hr />
        <ChildComponent message={this.props.message}/>
      </div>
    )
  }
}
