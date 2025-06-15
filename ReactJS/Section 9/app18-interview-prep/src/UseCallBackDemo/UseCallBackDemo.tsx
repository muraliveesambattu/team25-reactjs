// Parent Component
import React, { useCallback, useState } from "react";
import AddTodo from "./AddTodo";

function UseCallBackDemo() {
    const [todos, setTodos] = useState([]);
    const [count, setCount] = useState(0); // Some other unrelated state

      const addTodo = (text) => {
        setTodos([...todos, text]);
      };

    // const addTodo = useCallback((text) => {
    //     setTodos((prevTodos) => [...prevTodos, text]);
    // }, []);

    return (
        <>
            <AddTodo addTodo={addTodo} />
            <button onClick={() => setCount(count + 1)}>Increment: {count}</button>
        </>
    );
}

export default UseCallBackDemo;
