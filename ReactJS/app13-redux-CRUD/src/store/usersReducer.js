export const initialUsers = [
  {
    fname: "mkur",
    lname: "infotech",
    email: "vmrinfotech25@gmail.com",
    password: "123",
    id: 1,
  },
  {
    fname: "mm",
    lname: "kk",
    email: "mm@gmail.com",
    password: "123",
    id: 2,
  },
  {
    fname: "SSS",
    lname: "KKK",
    email: "sss@gmail.omc",
    password: "ddd",
    id: 3,
  },
];
export const usersReducer = (state = initialUsers, action) => {
  switch (action.type) {
    case "CREATE_USER":
      return [...state, action.payload];
      break;
    case "DELETE_USER":
      return state.filter((usr) => {
        return usr.email !== action.payload.email;
      });
      break;

    case "UPDATE_USER":
        const newUsers = [...state];
        newUsers[action.payload.index] = action.payload.user
      return newUsers
      break;

    default:
      return state;
  }
};
