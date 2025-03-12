import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MovieTicket from "./MiniProjects/Project8-MovieTicket/MovieTicket";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MovieTicket />
    </>
  );
}

export default App;
