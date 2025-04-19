import React, { useState } from 'react'

const UserForm = () => {
    const [userDetails,setUserDetails] = useState({
        fname:"",
        lname:"",
        email:""
    })

    const handleChange=(e)=>{
        const newUser = {...userDetails};
        newUser[e.target.name] = e.target.value;
        setUserDetails(newUser)
    }

    const handleSubmit = ()=>{
        console.log(userDetails)
    }
  return (
    <div>
      <form action="">
        <label htmlFor="">First Name :</label>
        <input type="text" name="fname"  value={userDetails.fname} onChange={handleChange}/> <br />
        <label htmlFor="">Last Name : </label>
        <input type="text" name="lname"  value={userDetails.lname} onChange={handleChange}/> <br />
        <label htmlFor="">Email</label>
        <input type="text" name="email"  value={userDetails.email} onChange={handleChange}/> <br />
        <button type='button' onClick={handleSubmit}>Add User</button>
      </form>
    </div>
  )
}

export default UserForm
