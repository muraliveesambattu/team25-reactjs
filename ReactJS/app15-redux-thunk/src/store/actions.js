import axios from "axios";

export const addUserAction = (user) => {
  return async (dispatch) => {
    try {
      const resp = await axios.post("http://localhost:3000/users", user);
      const response = await axios.get("http://localhost:3000/users");
      dispatch({
        type: "GET_USERS",
        payload: response.data,
      });
    } catch (error) {}
  };
};
export const getUserAction = (user) => {
  return async (dispatch) => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      dispatch({
        type: "GET_USERS",
        payload: response.data,
      });
    } catch (error) {}
  };
};

export const deleteUserAction = (user) => {
  return async (dispatch) => {
    try {
      const resp = await axios.delete("http://localhost:3000/users/" + user.id);
      const response = await axios.get("http://localhost:3000/users");
      dispatch({
        type: "GET_USERS",
        payload: response.data,
      });
    } catch (error) {}
  };
};

export const updateUserAction = (user) => {
  return async (dispatch) => {
    try {
      const resp = await axios.put(
        "http://localhost:3000/users/" + user.id,
        user
      );
      const response = await axios.get("http://localhost:3000/users");
      dispatch({
        type: "GET_USERS",
        payload: response.data,
      });
    } catch (error) {}
  };
};
