import React from 'react'

interface UserInterface {
    hello: string;
    info:string
}
const User = (props: UserInterface) => {
    const changeValue = (num1: number, num2: number) => {
        console.log(num1 + num2)
    };

    return (
        <div>
            <h2>Welcome to User Component !!! - Team 25 Type Script demo ---- !! </h2>
            <button onClick={() => { changeValue(12, 13) }}>Change Value </button>
            <h2>{props.hello}</h2>
        </div>
    )
}

export default User
