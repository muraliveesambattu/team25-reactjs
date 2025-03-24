import { createContext } from "react";

export const UserContext = createContext();
export const UserContextProvider = UserContext.Provider; // Use this when you add the data 
export const UserContextConsumber = UserContext.Consumer; // Use this when you receive the data;