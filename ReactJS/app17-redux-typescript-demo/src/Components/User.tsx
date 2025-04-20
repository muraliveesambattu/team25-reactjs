import React, { useState } from 'react'
import { UserContextConsumber } from './UserContext';
import Students from './Students';

interface UserInterface {
    usersInfo: string[]
}
const User: React.FC<UserInterface> = (props: UserInterface) => {
    const [age , setAge] = useState(10)
    const changeValue = (num1: number, num2: number) => {
        console.log(num1 + num2)
    };

    return (
        <div>
            {/* <h2>Welcome to User Component !!!</h2>
            <button onClick={() => { changeValue(12, 13) }}>Change Value </button>
            <UserContextConsumber>
               {(val)=>{
                console.log(val)
                return <ul>
                    {val.map((item)=>{
                        return <li>{item}</li>
                    })}
                </ul>
               }}
            </UserContextConsumber> */}
            <button onClick={()=>{setAge(age+5)}}>Change Age</button>
            <Students age={age}/>
        </div>
    )
}

export default User
