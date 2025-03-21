import React, { Component } from 'react'

export default class UserComp extends Component {
  render() {
    return (
      <div>
        <h2>Welcome to User Component</h2>
        <button
          onClick={this.props.handleInfo}
        >
          Increase Value
        </button>

        {this.props.render()}
      </div>
    )
  }
}
