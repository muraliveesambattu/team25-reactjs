import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import User from './Components/User'

function App() {
  const [count, setCount] = useState(0)

  return (
   <User hello={"How are you "} info={"ddd"}/>
  )
}

export default App
