import React, { useState } from 'react';

import NewTodo from './components/NewTodo';
import TodoList from './components/TodoList';
import { Todo } from './todo.model';

function App() {
  const [todoId, setTodoId] = useState<number>(1);
  const [todos, setTodos] = useState<Todo[]>([]);

  const todoAddHandler = (text: string) => {
    setTodos((prevState) => {
      return [...prevState, { id: `t${todoId}`, text }];
    });

    setTodoId(todoId + 1);
  };

  const todoDeleteHandler = (todoId: string) => {
    setTodos((prevState) => {
      return prevState.filter((todo) => todo.id !== todoId);
    });
  };

  return (
    <div className='App'>
      <NewTodo onAddItem={todoAddHandler} />
      <TodoList items={todos} onDeleteItem={todoDeleteHandler} />
    </div>
  );
}

export default App;
