import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Users from './Users'
import StudentManagement from './StudentManagement'

function App() {
  const [count, setCount] = useState(0)

  return (
     <>
     {/* <Users/> */}
     <StudentManagement/>
     </>
  )
}

export default App
