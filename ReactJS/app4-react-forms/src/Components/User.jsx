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
      users: [],
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
          <button type="button" onClick={this.addUser}>
            Add User
          </button>
        </form>

        <hr />
        {this.state.users.map(function (user){
            return <ul>
                <li>{user.fname}</li>
                <li>{user.lname}</li>
                <li>{user.email}</li>
            </ul>
        })}
      </div>
    );
  }
}

export default User;
