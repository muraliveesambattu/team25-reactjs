import { useState } from "react";
import "./App.css";
import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { Suspense } from "react";

const Register = lazy(() => import("./Components/Register"));
const Login = lazy(() => import("./Components/Login"));
const Dashboard = lazy(() => import("./Components/Dashboard"));


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
