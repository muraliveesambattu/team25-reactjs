import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [erroMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const newUser = { ...user };
    newUser[e.target.name] = e.target.value;
    setUser(newUser);
  };
  const handleSubmit = () => {
    console.log(user);
    const allUsersFromLocalStorage = JSON.parse(localStorage.getItem("users"));
    console.log(allUsersFromLocalStorage);
    var isLoginSuccss = false;
    allUsersFromLocalStorage.forEach((usr) => {
      console.log(usr);
      if (usr.email === user.email && usr.password === user.password) {
        isLoginSuccss = true;
      }
    });

    if (isLoginSuccss) {
      console.log("Login Successfull !!");
      navigate("/dashboard");
    } else {
      setErrorMessage("Login Failed !! .Please use Valid Credentials .");
      console.log("Login Failed !!");
    }
  };
  return (
    <div>
      <h2>Welcome to Login page</h2>

      <form>
        <label htmlFor="">Email :</label>
        <input
          type="text"
          name="email"
          value={user.email}
          onChange={handleChange}
        />{" "}
        <br />
        <label htmlFor="">Password :</label>
        <input
          type="text"
          name="password"
          value={user.password}
          onChange={handleChange}
        />{" "}
        <br />
        <button type="button" onClick={handleSubmit}>
          Register
        </button>
      </form>
      <p style={{ color: "red" }}>{erroMessage}</p>
    </div>
  );
};

export default Login;
