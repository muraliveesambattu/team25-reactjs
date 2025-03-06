const { Component } = require("react");

class User extends Component {
  constructor() {
    super();
    this.state = {
      person: {
        fname: "",
        lname: "",
        email: "",
      },
      users: [
        { fname: "Ram", lname: "Kumar", email: "ram@gmail.com" },
        { fname: "Sam", lname: "Kumar", email: "sam@gmail.com" },
        { fname: "Kiran", lname: "Kumar", email: "ram@gmail.com" },
      ],
      editIndex: null,
    };
  }
  handleChange = (e) => {
    console.log(e.target.name);
    const newPerson = { ...this.state.person }; // Copy of the state Object
    newPerson[e.target.name] = e.target.value; // Change the propety of the Object
    this.setState({ person: newPerson });
  };

  addUser = () => {
    const newUsers = [...this.state.users];
    newUsers.push(this.state.person);
    this.setState({ users: newUsers });
    console.log(this.state.person);
    this.clearUser();
  };

  clearUser = () => {
    this.setState({ person: { fname: "", lname: "", email: "" } });
  };

  handleDelete = (i) => {
    const newUsers = [...this.state.users];
    newUsers.splice(i, 1);
    this.setState({ users: newUsers });
  };

  handleEdit = (user, i) => {
    this.setState({ person: user, editIndex: i });
  };

  handleUpdate = () => {
    const newUsers = [...this.state.users];
    newUsers[this.state.editIndex] = this.state.person;
    this.setState({ users: newUsers, editIndex: null });
    this.clearUser()
  };
  render() {
    return (
      <div>
        <form action="">
          <label htmlFor="">First Name : </label>
          <input
            type="text"
            name="fname"
            id=""
            value={this.state.person.fname}
            onChange={this.handleChange}
          />{" "}
          <br />
          <label htmlFor="">Last Name : </label>
          <input
            type="text"
            name="lname"
            id=""
            value={this.state.person.lname}
            onChange={this.handleChange}
          />{" "}
          <br />
          <label htmlFor="">Email : </label>
          <input
            type="text"
            name="email"
            id=""
            value={this.state.person.email}
            onChange={this.handleChange}
          />{" "}
          <br />
          {this.state.editIndex === null ? (
            <button type="button" onClick={this.addUser}>
              Add User
            </button>
          ) : (
            <button type="button" onClick={this.handleUpdate}>
              Update User
            </button>
          )}
        </form>

        <hr />
        <table border={1}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
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
                  <td>
                    <button
                      onClick={() => {
                        this.handleEdit(user, i);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button onClick={() => this.handleDelete(i)}>Delete</button>
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

export default User;
