import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Registration from "./Components/Registration";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import UserDetails from "./Components/UserDetails";
import NavBar from "./Components/NavBar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="" element={<Registration />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="userdetails/:id" element={<UserDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
