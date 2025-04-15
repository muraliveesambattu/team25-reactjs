const initialData = ["Ravi Kumar", "Sam KUmar", "Murali", "Kiran"];

const usersReducer = (state = initialData, action) => {
  switch (action.type) {
    case "CREATE":
      break;
    case "READ":
      break;
    case "UPDATE":
      break;
    case "DELETE":
      break;

    default:
      return state;
  }
};

export default usersReducer