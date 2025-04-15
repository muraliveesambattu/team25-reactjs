import React, { Component } from "react";
import { connect } from "react-redux";

class Employees extends Component {

  render() {
    console.log(this.props);
    return (
      <div>
        <ul>
          {/* {this.state.employeeDetails.map((emp) => {
            return <li>{emp}</li>;
          })} */}
          {this.props.employees.map((emp) => {
            return <li>{emp}</li>;
          })}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}
export default connect(mapStateToProps)(Employees);
