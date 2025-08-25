/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import * as todosService from '../../api/todos';

type Props = {
  updateTodo: (value: Todo) => Promise<void>;
  todo: Todo;
  deleteTodo: (id: number) => Promise<void>;
  isChanging: boolean;
  isChangingSeveral: boolean;
  isSubmitting?: boolean;
  setChangingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  changingTodoId: number | null;
  editedTitle: string;
  setEditedTitle: React.Dispatch<React.SetStateAction<string>>;
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
  editedTitle,
  setEditedTitle,
}) => {
  function handleUpdateSubmit(event: React.FormEvent) {
    event.preventDefault();

    updateTodo({
      id: todo.id,
      title: editedTitle,
      completed: todo.completed,
      userId: todosService.USER_ID,
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

      {changingTodoId === todo.id ? (
        <form onSubmit={handleUpdateSubmit}>
          <input
            data-cy="TodoTitlemainInput"
            type="text"
            className="todo__title-mainInput"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
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
