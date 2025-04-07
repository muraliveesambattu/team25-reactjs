import axios from "axios";
import React, { Component } from "react";

import { useNavigate } from "react-router-dom";

export function withNavigation(Component) {
  return function WrappedComponent(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };
  }

  getAllUsersFromServer() {
    axios.get("http://localhost:3000/users").then(({ data }) => {
      console.log(data);
      this.setState({ users: data });
    });
  }
  componentDidMount() {
    this.getAllUsersFromServer();
  }
  handleViewDetails = (usr) => {
    this.props.navigate("/userDetails/" + usr.id)
  };
  render() {
    return (
      <div>
        <div className="container">
          <table class="table">
            <thead>
              <tr>
                <th>First</th>
                <th>Last</th>
                <th>Email</th>
                <th>Password</th>
                <th>ID</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {this.state.users.map((usr) => {
                return (
                  <tr>
                    <td>{usr.fname}</td>
                    <td>{usr.lname}</td>
                    <td>{usr.email}</td>
                    <td>{usr.password}</td>
                    <td>{usr.id}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          this.handleViewDetails(usr);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-danger">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default withNavigation(Dashboard);
