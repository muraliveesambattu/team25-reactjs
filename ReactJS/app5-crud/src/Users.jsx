import React, { Component } from "react";

export default class Users extends Component {
  // 1. Mounting Phase
  // 2. Updateing Phase
  // 3. Unmounting Phase
  constructor() {
    super();
    this.state = {
      users: [],
    };
  }

  handleDelete = (usr) => {
    fetch("http://localhost:3000/users/" + usr.id, {
      method: "DELETE",
    }).then(() => {
      this.getUsersFromServer();
    });
  };
  render() {
    return (
      <div>
        <h2>Welcome to Users Component !!!! </h2>
        <table border={1}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>ID</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map((user, i) => {
              return (
                <tr key={i}>
                  <td>{user.fname}</td>
                  <td>{user.lname}</td>
                  <td>{user.email}</td>
                  <td>{user.id}</td>
                  <td>
                    <button>Edit</button>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        this.handleDelete(user);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  getUsersFromServer = () => {
    fetch("http://localhost:3000/users")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ users: data });
      });
  };
  componentDidMount() {
    this.getUsersFromServer();
  }
  createUser = () => {
    fetch("http://localhost:3000/users", {
      method: "POST",
      body: JSON.stringify(user),
    }).then(() => {
      this.getUsersFromServer();
    });
  };

  updateUser = () => {
    fetch("http://localhost:3000/users/"+user.id, {
      method: "PUT",
      body: JSON.stringify(user),
    }).then(() => {
      this.getUsersFromServer();
    });
  };
}
