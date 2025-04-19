import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import User from './Components/User'
import Main from './Components/Main'

function App() {
  const [count, setCount] = useState(0)

  return (
    //  <User hello={"How are you "} info={"ddd"}/>
    <Main />
  )
}

export default App
