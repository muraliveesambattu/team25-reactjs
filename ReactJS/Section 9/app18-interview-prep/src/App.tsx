import { useEffect, useRef, useState } from 'react'
import './App.css'
import MyCounterComp from './MyCounterComp';
import ExampleComponent from './UseMemoDemo/ExampleComponent';
import ExampleComponentUseMemo from './UseMemoDemo/ExampleComponentUseMemo';
import UseCallBackDemo from './UseCallBackDemo/UseCallBackDemo';

function App() {
  const [count, setCount] = useState(0);

  var myInputField = useRef(null); // Creating a Reference using UseRef;


  // useEffect(() => {
  //   console.log(myInputField)
  //   if (myInputField.current) {
  //     myInputField.current.value = "10"
  //     // myInputField.current.focus();
  //   }
  // }, [])

  // const handleClick = () => {
  //   myInputField.current.value = "20";
  // }
    // const items = ;

  return (
    <>
    <button onClick={()=>{setCount(count+20)}}>App Count Value</button>
      <h2>Count In App Comp : {count}</h2>
      {/* Attaching to DOM element using ref attribute  */}
      {/* <input type="text" name="" id="" ref={myInputField} /> */}
      {/* <button onClick={handleClick}>Change Value</button> */}
      {/* <MyCounterComp /> */}
      {/* <ExampleComponent/> */}
      {/* <hr /> */}
      {/* <ExampleComponentUseMemo /> */}
      <UseCallBackDemo/>
    </>
  )
}

export default App
