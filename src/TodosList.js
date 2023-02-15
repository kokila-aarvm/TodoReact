import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

const fetchTodos = () => async (dispatch) => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/todos"
  );

  dispatch({ type: "RECEIVE_TODOS", payload: response.data });
};

const TodosList = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state);

  const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const deleteTodo = (id) => {
    dispatch({ type: "DELETE_TODO", payload: id });
  };

  const updateTodo = (id, title) => (dispatch) => {
    dispatch({ type: "UPDATE_TODO", payload: { id, title } });
  };

  return (
    <ol>
      {todos.map((todo) => (
        <li key={todo.id}>
          {editTodo && editTodo.id === todo.id ? (
            <>
              <input
                type="text"
                value={editTodo.title}
                onChange={(e) =>
                  setEditTodo({ ...editTodo, title: e.target.value })
                }
              />
              <button
                onClick={() => {
                  dispatch(updateTodo(todo.id, editTodo.title));
                  setEditTodo(null);
                }}
              >
                Update
              </button>
              <button onClick={() => dispatch(deleteTodo(todo.id))}>
                Delete
              </button>
            </>
          ) : (
            <>
              {todo.title}
              <button onClick={() => setEditTodo(todo)}>Edit</button>
              <button onClick={() => dispatch(deleteTodo(todo.id))}>
                Delete
              </button>
            </>
          )}
        </li>
      ))}
    </ol>
  );
};

const todosReducer = (state = [], action) => {
  switch (action.type) {
    case "RECEIVE_TODOS":
      return action.payload;
    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload);
    case "UPDATE_TODO":
      const { id, title } = action.payload;
      return state.map((todo) => (todo.id === id ? { ...todo, title } : todo));

    default:
      return state;
  }
};

export const store = configureStore({
  reducer: todosReducer,
});

export default TodosList;
