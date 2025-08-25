/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import * as todosService from '../../api/todos';
import { useRef, useState } from 'react';

type Props = {
  updateTodo: (value: Todo) => Promise<void>;
  updateTitleTodo: (value: Todo) => Promise<void>;
  todo: Todo;
  deleteTodo: (id: number) => Promise<void>;
  isChanging: boolean;
  isChangingSeveral: boolean;
  isSubmitting?: boolean;
  editedTitle: string;
  setEditedTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const ToDo: React.FC<Props> = ({
  updateTodo,
  updateTitleTodo,
  todo,
  deleteTodo,
  isChanging,
  isChangingSeveral,
  isSubmitting,
  editedTitle,
  setEditedTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const todoEditingInput = useRef<HTMLInputElement>(null);

  function handleUpdateSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!editedTitle.trim()) {
      deleteTodo(todo.id);
      setIsEditing(false);

      return;
    }

    if (editedTitle.trim() === todo.title) {
      setIsEditing(false);
      setEditedTitle(todo.title);

      return;
    }

    updateTitleTodo({
      id: todo.id,
      title: editedTitle,
      completed: todo.completed,
      userId: todosService.USER_ID,
    }).then(() => {
      setIsEditing(false);
    });
  }

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" htmlFor={`${todo.id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          id={`${todo.id}`}
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodo(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleUpdateSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-mainInput"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={() => setIsEditing(false)}
            ref={todoEditingInput}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              todoEditingInput.current?.focus();
              setIsEditing(true);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isChanging || isChangingSeveral || isSubmitting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
