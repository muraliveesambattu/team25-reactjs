// Child Component
import React from "react";

function AddTodo({ addTodo }) {
    console.log("🔁 AddTodo Rendered");

    return (
        <button onClick={() => addTodo("New Task")}>Add Todo </button>
    );
}

export default React.memo(AddTodo); // React.memo to avoid re-rendering if props don’t change
