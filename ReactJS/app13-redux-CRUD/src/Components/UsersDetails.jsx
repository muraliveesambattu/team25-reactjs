import React, { Component } from "react";
import { connect } from "react-redux";
import {
  addUserAction,
  deleteUserAction,
  updateUserAction,
} from "../store/actions";

class UsersDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        fname: "",
        lname: "",
        email: "",
        password: "",
      },
      editIndex: null,
    };
  }

  handleChange = (e) => {
    const newUser = { ...this.state.user };
    newUser[e.target.name] = e.target.value;
    this.setState({ user: newUser });
  };

  handleSubmit = () => {
    this.props.dispatch(addUserAction(this.state.user));
    this.setState({
      user: {
        fname: "",
        lname: "",
        email: "",
        password: "",
      },
    });
  };

  handleDelete = (user) => {
    this.props.dispatch(deleteUserAction(user));
  };

  handleEdit = (user, i) => {
    this.setState({ user, editIndex: i });
  };

  handleUpdate = (user) => {
    const data = {
        user : this.state.user,
        index : this.state.editIndex
    }
    this.props.dispatch(updateUserAction(data));
    this.setState({
        user: {
            fname: "",
            lname: "",
            email: "",
            password: "",
          },
          editIndex:null
    })
  };

  render() {
    console.log(this.props);
    return (
      <div>
        <h2>Welcome to Users Details !!</h2>
        <form>
          <label htmlFor="">First Name : </label>
          <input
            type="text"
            name="fname"
            value={this.state.user.fname}
            onChange={(e) => {
              this.handleChange(e);
            }}
          />{" "}
          <br />
          <label htmlFor="">Last Name : </label>
          <input
            type="text"
            name="lname"
            value={this.state.user.lname}
            onChange={(e) => {
              this.handleChange(e);
            }}
          />{" "}
          <br />
          <label htmlFor="">Email : </label>
          <input
            type="text"
            name="email"
            value={this.state.user.email}
            onChange={(e) => {
              this.handleChange(e);
            }}
          />{" "}
          <br />
          <label htmlFor="">Password: </label>
          <input
            type="text"
            name="password"
            value={this.state.user.password}
            onChange={(e) => {
              this.handleChange(e);
            }}
          />{" "}
          <br />
          {this.state.editIndex === null ? (
            <button
              style={{ background: "blue", color: "white", margin: "10px" }}
              type="button"
              onClick={this.handleSubmit}
            >
              Add User
            </button>
          ) : (
            <button
              style={{ background: "blue", color: "white", margin: "10px" }}
              type="button"
              onClick={this.handleUpdate}
            >
              Update User
            </button>
          )}
        </form>
        <table border={1}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>ID</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.props.users &&
              this.props.users.map((usr, i) => {
                return (
                  <tr key={i}>
                    <td>{usr.fname}</td>
                    <td>{usr.lname}</td>
                    <td>{usr.email}</td>
                    <td>{usr.password}</td>
                    <td>{usr.id}</td>
                    <td>
                      <button
                        style={{ background: "grey", color: "white" }}
                        onClick={() => {
                          this.handleEdit(usr, i);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        style={{ background: "red", color: "white" }}
                        onClick={() => {
                          this.handleDelete(usr);
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
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(UsersDetails);
