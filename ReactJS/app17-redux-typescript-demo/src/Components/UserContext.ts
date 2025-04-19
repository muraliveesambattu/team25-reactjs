import { createContext } from "react";

const userContext = createContext<string[]>([]);

export const UserContextProvider = userContext.Provider;
export const UserContextConsumber = userContext.Consumer;
