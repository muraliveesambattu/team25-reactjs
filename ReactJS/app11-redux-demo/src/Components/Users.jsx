import React, { Component } from "react";
import { connect } from "react-redux";

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usersDetails: ["Ram", "Ravi", "Sam"],
    };
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <ul>
          {/* {this.state.usersDetails.map((usr) => {
            return <li>{usr}</li>;
          })} */}
          {this.props.users.map((usr) => {
            return <li>{usr}</li>;
          })}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Users);
