import React, { useRef } from 'react';

import './NewTodo.css';

type NewTodoProps = {
  onAddItem: (todoText: string) => void;
};

function NewTodo({ onAddItem }: NewTodoProps) {
  // const [value, setValue] = useState<string | null>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const todoSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const enteredValue = textInputRef.current!.value;

    if (enteredValue) {
      onAddItem(enteredValue);
      textInputRef.current!.value = '';
    }
  };

  return (
    <form onSubmit={todoSubmitHandler}>
      <div className='form-control'>
        <label htmlFor='todo-text'>Todo Text</label>
        <input type='text' id='todo-text' ref={textInputRef} />
      </div>
      <button type='submit'>ADD TODO</button>
    </form>
  );
}

export default NewTodo;
