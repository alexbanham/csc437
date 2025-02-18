import { useState } from "react";

function AddTaskForm({ onNewTask }) {
    const [taskText, setTaskText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onNewTask(taskText);
        setTaskText(""); // Clear input field after submission
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                placeholder="New task name"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 active:bg-blue-700"
            >
                Add task
            </button>
        </form>
    );
}

export default AddTaskForm;
