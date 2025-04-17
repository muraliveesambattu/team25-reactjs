import { createSlice } from "@reduxjs/toolkit";

const initialUsers = [
    {
      "firstName": "Murali",
      "lastName": "Reddy",
      "email": "murali.reddy@example.com",
      "password": "murali@123",
      "gender": "Male"
    },
    {
      "firstName": "Anjali",
      "lastName": "Sharma",
      "email": "anjali.sharma@example.com",
      "password": "anjali@456",
      "gender": "Female"
    },
    {
      "firstName": "Raj",
      "lastName": "Kumar",
      "email": "raj.kumar@example.com",
      "password": "raj@789",
      "gender": "Male"
    },
    {
      "firstName": "Sneha",
      "lastName": "Verma",
      "email": "sneha.verma@example.com",
      "password": "sneha@321",
      "gender": "Female"
    },
    {
      "firstName": "Aryan",
      "lastName": "Patel",
      "email": "aryan.patel@example.com",
      "password": "aryan@654",
      "gender": "Other"
    }
  ]
  
const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: initialUsers,
  },
  reducers: {
    createUserAction: (state, action) => {
      state.users.push(action.payload);
    },
    readUsersAction: (state, action) => {},
    updateUsersAction: (state, action) => {
        state.users [action.payload.index] = action.payload.value
    },
    deleteUserAction: (state, action) => {
      state.users = state.users.filter(
        (usr) => usr.email !== action.payload.email
      );
    },
  },
});

export default usersSlice.reducer;
export const {
  createUserAction,
  readUsersAction,
  updateUsersAction,
  deleteUserAction,
} = usersSlice.actions;
