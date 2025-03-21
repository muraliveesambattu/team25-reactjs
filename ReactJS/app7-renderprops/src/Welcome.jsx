import React, { Component } from 'react'

export default class Welcome extends Component {
  render() {
    return (
      <div>
        <h2>Hi , {this.props.studentName} Hello I am from Welcome Component !!!</h2>
      </div>
    )
  }
}
