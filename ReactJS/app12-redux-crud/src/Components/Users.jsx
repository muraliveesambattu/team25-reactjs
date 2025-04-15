import React, { Component } from "react";
import { connect } from "react-redux";

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      editIndex: null,
    };
  }

  handleChange = (e) => {
    console.log(e);
    this.setState({ user: e.target.value });
  };

  handleAddUser = () => {
    this.props.dispatch({
      type: "CREATE_USER",
      payload: this.state.user,
    });
    this.setState({ user: "" });
  };

  handleDelete = (user) => {
    this.props.dispatch({
      type: "DELETE_USER",
      payload: user,
    });
  };

  handleEdit = (user, i) => {
   
    this.setState({ user, editIndex: i });
  };

  handleUpdateUser = (user) => {
    this.props.dispatch({
      type: "UPDATE_USER",
      payload: {
        index: this.state.editIndex,
        value: this.state.user,
      },
    });
    this.setState({ user: "", editIndex: null });
  };
  render() {
    console.log(this.props);
    return (
      <div>
        <h2>Welcome to Users Component</h2>
        <input
          type="text"
          name=""
          value={this.state.user}
          onChange={this.handleChange}
        />{" "}
        {this.state.editIndex === null ? (
          <button onClick={this.handleAddUser}>Add User</button>
        ) : (
          <button onClick={this.handleUpdateUser}>Update User</button>
        )}
        <ul>
          {this.props.users.map((user, i) => {
            return (
              <li key={i}>
                <span
                  onClick={() => {
                    this.handleEdit(user, i);
                  }}
                >
                  {user}
                </span>
                <span
                  style={{
                    background: "red",
                    color: "white",
                    margin: "50px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    this.handleDelete(user);
                  }}
                >
                  {" "}
                  X{" "}
                </span>
              </li>
            );
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
