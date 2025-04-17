import React, { Component } from "react";
import { connect } from "react-redux";
import {
  createUserAction,
  deleteUserAction,
  updateUsersAction,
} from "../store/usersSlice";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        gender: "",
      },
      editIndex: null,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    const newUser = { ...this.state.user };
    newUser[name] = value;
    console.log(newUser);
    this.setState({ user: newUser });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.dispatch(createUserAction(this.state.user));
    // Reset the form
    this.setState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      gender: "",
    });
  };

  handleDelete = (user) => {
    this.props.dispatch(deleteUserAction(user));
  };

  handleEdit = (user, index) => {
    console.log(user);
    this.setState({ user, editIndex: index });
  };

  handleUpdate = () => {
    this.props.dispatch(
      updateUsersAction({
        value: this.state.user,
        index: this.state.editIndex,
      })
    );
    this.setState({
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        gender: "",
      },
      editIndex: null,
    });
  };
  render() {
    const { firstName, lastName, email, password, gender } = this.state.user;
    const {
      users: { users },
    } = this.props;
    console.log(users);

    return (
      <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
        <h2>User Registration</h2>
        <form>
          <div>
            <label>First Name:</label>
            <br />
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={this.handleChange}
              required
            />
          </div>

          <div>
            <label>Last Name:</label>
            <br />
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={this.handleChange}
              required
            />
          </div>

          <div>
            <label>Email:</label>
            <br />
            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleChange}
              required
            />
          </div>

          <div>
            <label>Password:</label>
            <br />
            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
              required
            />
          </div>

          <div>
            <label>Gender:</label>
            <br />
            <select
              name="gender"
              value={gender}
              onChange={this.handleChange}
              required
            >
              <option value="">--Select--</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {this.state.editIndex === null ? (
            <div style={{ marginTop: "10px" }}>
              <button type="button" onClick={this.handleSubmit}>
                Register
              </button>
            </div>
          ) : (
            <div style={{ marginTop: "10px" }}>
              <button type="button" onClick={this.handleUpdate}>
                Update User
              </button>
            </div>
          )}
        </form>

        {users.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <h3>Registered Users</h3>
            <table border="1" cellPadding="8" cellSpacing="0" width="100%">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Gender</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>{user.gender}</td>
                    <td>
                      <button
                        style={{ background: "grey" }}
                        onClick={() => {
                          this.handleEdit(user, index);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        style={{ background: "red " }}
                        onClick={() => {
                          this.handleDelete(user);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(User);
