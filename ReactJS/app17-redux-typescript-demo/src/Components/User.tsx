import React from 'react'
import { UserContextConsumber } from './UserContext';

interface UserInterface {
    usersInfo: string[]
}
const User: React.FC<UserInterface> = (props: UserInterface) => {
    const changeValue = (num1: number, num2: number) => {
        console.log(num1 + num2)
    };

    return (
        <div>
            <h2>Welcome to User Component !!!</h2>
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
            </UserContextConsumber>
        </div>
    )
}

export default User
