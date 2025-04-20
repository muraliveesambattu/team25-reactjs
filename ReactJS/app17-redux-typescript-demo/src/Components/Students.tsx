import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Students = ({age}) => {
    const [allStudents, setAllStudents] = useState([])
    const getUsersFromServer = () => {
        axios.get("https://jsonplaceholder.typicode.com/users").then(({ data }) => {
            console.log(data)
            setAllStudents(data)
        })
    }
    useEffect(() => {
        getUsersFromServer();
    }, [age,val,sample]);
    
    return (
        <div>
            <h2>Welcome to Students Component !!!</h2>
            <h2>{age}</h2>
            <ul>
                {allStudents.map((std, i) => {
                    return <li key={i}>{std.username}</li>
                })}
            </ul>
        </div>
    )
}

export default Students
