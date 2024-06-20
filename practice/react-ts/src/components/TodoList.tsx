import React from 'react';

import './TodoList.css';

interface TodoListProps {
  items: { id: string; text: string }[];
  onDeleteItem: (todoId: string) => void;
}

function TodoList({ items, onDeleteItem }: TodoListProps) {
  return (
    <ul>
      {items.map((todo) => (
        <li key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={onDeleteItem.bind(null, todo.id)}>DELETE</button>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
