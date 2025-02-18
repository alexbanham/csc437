import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function TodoItem({ id, name, completed, onToggleCompleted, onRemove }) {
    return (
        <li className="flex items-center justify-between p-2 border rounded bg-gray-50">
            <div className="flex items-center gap-2">
                <input
                    id={id}
                    type="checkbox"
                    checked={completed}
                    onChange={() => onToggleCompleted(id)}
                    className="w-5 h-5"
                />
                <label htmlFor={id} className="cursor-pointer">{name}</label>
            </div>
            <button
                onClick={() => onRemove(id)}
                className="text-gray-500 hover:text-gray-700 active:text-gray-900"
                title="Delete task"
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </li>
    );
}

export default TodoItem;
