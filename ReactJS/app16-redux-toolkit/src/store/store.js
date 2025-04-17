import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./counterSlice";
import usersSlice from "./usersSlice";
export const store = configureStore({
  reducer: {
    counter: counterSlice,
    users: usersSlice,
  },
});
