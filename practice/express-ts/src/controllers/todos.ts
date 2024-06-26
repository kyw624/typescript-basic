import { RequestHandler } from 'express';

import { Todo } from '../models/todo';

const TODOS: Todo[] = [];

export const createTodo: RequestHandler = (req, res, next) => {
  const text = (req.body as { text: string }).text;
  const newTodo = new Todo(Math.random().toString(), text);

  TODOS.push(newTodo);

  res.status(201).json({ message: 'Created the todo.', createdTodo: newTodo });
};

export const getTodos: RequestHandler = (req, res, next) => {
  res.status(201).json({ todos: TODOS });
};

export const updateTodo: RequestHandler<{ id: string }> = (req, res, next) => {
  const todoId = req.params.id;
  const updatedText = (req.body as { text: string }).text;
  const targetIndex = TODOS.findIndex((todo) => todo.id === todoId);

  if (targetIndex < 0) {
    throw new Error('Could not find todo!');
  }

  TODOS[targetIndex] = new Todo(TODOS[targetIndex].id, updatedText);

  res.json({ message: 'Updated!', updatedTodo: TODOS[targetIndex] });
};

export const deleteTodo: RequestHandler = (req, res, next) => {
  const todoId = req.params.id;
  const targetIndex = TODOS.findIndex((todo) => todo.id === todoId);
  const target = TODOS[targetIndex];

  if (targetIndex < 0) {
    throw new Error('Could not find todo!');
  }

  TODOS.splice(targetIndex, 1);

  res.json({ message: 'Deleted!', deletedTodo: target, todos: TODOS });
};
