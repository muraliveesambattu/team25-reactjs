export const addUserAction = (user) => {
  return {
    type: "CREATE_USER",
    payload: user,
  };
};

export const deleteUserAction = (user) => {
  return {
    type: "DELETE_USER",
    payload: user,
  };
};

export const updateUserAction = (data) => {
  return {
    type: "UPDATE_USER",
    payload: data,
  };
};
