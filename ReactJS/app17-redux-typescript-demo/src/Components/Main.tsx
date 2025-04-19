import React, { useState } from 'react'
import Parent from './Parent'
import { UserContextProvider } from './UserContext'

const Main = () => {
    const [usersInfo, setUsersInfo] = useState(["Ram", "Ravi", "Sam", "Kiran"])
    const [newUsers, setNewUsers] = useState(["Murali", "Jaga", "Yamuna"])
    return (
        <div>
            <UserContextProvider value={newUsers}>
                <Parent usersInfo={usersInfo} />
            </UserContextProvider>

        </div>
    )
}

export default Main
