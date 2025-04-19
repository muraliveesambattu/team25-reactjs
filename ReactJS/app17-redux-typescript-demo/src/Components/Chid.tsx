import React from 'react'
import User from './User'

interface ChidProps {
    usersInfo: string[]
}
const Chid: React.FC<ChidProps> = ({ usersInfo }) => {
    return (
        <div>
            <User usersInfo={usersInfo} />
        </div>
    )
}

export default Chid
