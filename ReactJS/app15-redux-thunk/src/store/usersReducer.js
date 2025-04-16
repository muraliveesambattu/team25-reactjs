export const initialUsers = [];
export const usersReducer = (state = initialUsers, action) => {
  switch (action.type) {
    case "GET_USERS":
      return action.payload;
      break;
    case "DELETE_USER":
      return state.filter((usr) => {
        return usr.email !== action.payload.email;
      });
      break;

    case "UPDATE_USER":
      const newUsers = [...state];
      newUsers[action.payload.index] = action.payload.user;
      return newUsers;
      break;

    default:
      return state;
  }
};
