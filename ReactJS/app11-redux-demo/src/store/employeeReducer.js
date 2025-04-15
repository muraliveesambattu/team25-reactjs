const employees = [
  "Store Employee 1",
  "Store Employee 2",
  "Store Employee 3",
  "Store Employee 4",
  "Store Employee 5",
  "Store Employee 6",
  "Store Employee 7",
];

// Reducer Container all CRUD Operation Business logic
export const employeeReducer = (state = employees, action) => {
  switch (action.type) {
    case "CREATE":
      break;
    case "DELETE":
      break;

    default:
      return state;
  }
};
