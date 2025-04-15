const defaultUsers = ["Ram", "Ravi", "Sam", "Kumar"];
export const usersReducer = (state = defaultUsers, action) => {
  switch (action.type) {
    case "CREATE_USER":
      return [...state, action.payload];
      break;

    case "DELETE_USER":
      return state.filter((usr) => usr !== action.payload);
      break;
    case "UPDATE_USER":
     
      return state.map((user, idx) =>
        idx === action.payload.index ? action.payload.value : user
      );
      break;

    default:
      return state;
  }
};
