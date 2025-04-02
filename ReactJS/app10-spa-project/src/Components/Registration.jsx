import React, { Component } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
export function handleRouterNavigate(Component) {
  return function (props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}
class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        fname: "",
        lname: "",
        email: "",
        password: "",
      },
    };
  }

  handleRegistration = () => {
    console.log(this.state.user);
    axios.post("http://localhost:3000/users", this.state.user).then(() => {
      this.props.navigate("/login");
    });
    //
  };

  handleChange = (e) => {
    const newUser = { ...this.state.user };
    newUser[e.target.name] = e.target.value;
    this.setState({ user: newUser });
  };
  render() {
    const { fname, lname, email, password } = this.state.user;
    return (
      <div class="container ">
        <div class="row">
          <div class="col">Column</div>
          <div class="col">
            <div>
              <form>
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">
                    First Name
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    name="fname"
                    value={fname}
                    onChange={this.handleChange}
                  />
                </div>
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">
                    Last Name
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    name="lname"
                    value={lname}
                    onChange={this.handleChange}
                  />
                </div>
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    name="email"
                    value={email}
                    onChange={this.handleChange}
                  />
                </div>
                <div class="mb-3">
                  <label for="exampleInputPassword1" class="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    class="form-control"
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    class="btn btn-primary"
                    onClick={this.handleRegistration}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div class="col">Column</div>
        </div>
      </div>
    );
  }
}

export default handleRouterNavigate(Registration);
