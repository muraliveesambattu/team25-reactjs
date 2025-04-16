import { combineReducers, createStore } from "redux";
import { usersReducer } from "./usersReducer";
export const rootReducer = combineReducers({
    users:usersReducer
});

export const store = createStore(rootReducer);
