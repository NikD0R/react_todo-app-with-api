/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useState } from 'react';

type Props = {
  updateTodo: (value: Todo) => Promise<void>;
  todo: Todo;
  deleteTodo: (id: number) => Promise<void>;
  isChanging: boolean;
  isChangingSeveral: boolean;
  isSubmitting?: boolean;
  setChangingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  changingTodoId: number | null;
};

export const ToDo: React.FC<Props> = ({
  updateTodo,
  todo,
  deleteTodo,
  isChanging,
  isChangingSeveral,
  isSubmitting,
  setChangingTodoId,
  changingTodoId,
}) => {
  const [, setEditedTitle] = useState('');

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

      {changingTodoId === todo.id ? (
        <form>
          <input
            data-cy="TodoTitlemainInput"
            type="text"
            className="todo__title-mainInput"
            placeholder="Empty todo will be deleted"
            value={todo.title}
            onChange={event => setEditedTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setChangingTodoId(todo.id)}
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
