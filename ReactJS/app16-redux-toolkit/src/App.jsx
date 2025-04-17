import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Counter from './Components/Counter'
import User from './Components/Users'

function App() {
  const [count, setCount] = useState(0)

  return (
  // <Counter/>
  <User/>
  )
}

export default App
