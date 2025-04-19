// function SampleComp(){

import { useState } from "react";

// }

const SampleComp = () => {

    const [abc,changeAbcValue] = useState(10);
  
    return <div>
        <h2>Welcome to Sample Functional Component !!!</h2>
        <p>Count : {abc}</p>
        <button onClick={()=>{changeAbcValue(20)}}>Change Value</button>
    </div>
};
export default SampleComp