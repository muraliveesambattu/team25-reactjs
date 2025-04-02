import React, { Component } from "react";
import { handleRouterNavigate } from "./Registration";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        email: "",
        password: "",
      },
      errorMessage: "",
    };
  }

  handleDashboardNavigation = () => {
    this.props.navigate("/dashboard");
  };
  handleChange = (e) => {
    const newUser = { ...this.state.user };
    newUser[e.target.name] = e.target.value;
    this.setState({ user: newUser });
  };
  handleLogin = () => {
    console.log(this.state.user);
    // 1. Get ALL users from Server
    axios.get("http://localhost:3000/users").then(({ data }) => {
      console.log(data);
      const isUserExist = data.find((usr) => {
        return (
          usr.email === this.state.user.email &&
          usr.password === this.state.user.password
        );
      });
      if (isUserExist) {
        this.props.navigate("/dashboard");
      } else {
        this.setState({ errorMessage: "Invalid Login " });
      }
      console.log(isUserExist);
    });
    // 2. Check the Logged In user in that Data or Not
    // 3. If the User is available , then Navigate to Dashboard
    // 4. Otherwise , show an error Message
  };
  render() {
    const { email, password } = this.state.user;

    return (
      <div>
        <h2>Welcome to Login Page</h2>
        <div class="row">
          <div class="col">Column</div>
          <div class="col">
            <div>
              <form>
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
                    onClick={this.handleLogin}
                  >
                    Submit
                  </button>
                  <h2 style={{color:"red"}}>{this.state.errorMessage}</h2>
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

export default handleRouterNavigate(Login);
