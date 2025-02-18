import { useState } from "react";
import { nanoid } from "nanoid";
import TodoItem from "./components/TodoItem";
import AddTaskForm from "./components/AddTaskForm";
import Modal from "./components/Modal";
import { GroceryPanel } from "./components/GroceryPanel";

function App({ tasks }) {
    const [taskList, setTaskList] = useState(tasks);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const addTask = (taskName) => {
        if (!taskName.trim()) return;
        const newTask = { id: `todo-${nanoid()}`, name: taskName, completed: false };
        setTaskList([...taskList, newTask]);
        setIsModalOpen(false); // Close modal after adding task
    };

    const toggleTaskCompleted = (taskId) => {
        setTaskList(taskList.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    const removeTask = (taskId) => {
        setTaskList(taskList.filter(task => task.id !== taskId));
    };

    const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
    const headingText = `${taskList.length} ${tasksNoun} remaining`;

    return (
        <main className="m-4 max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white">


            {/* Open Modal Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="mb-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 active:bg-blue-700"
            >
                New Task
            </button>

            {/* Modal Component */}
            <Modal
                headerLabel="Add a New Task"
                isOpen={isModalOpen}
                onCloseRequested={() => setIsModalOpen(false)}
            >
                <AddTaskForm onNewTask={addTask}/>
            </Modal>

            <h1 className="text-xl font-bold text-left mb-4">Todo List</h1>

            <section className="mt-4">
                <h2 id="list-heading">{headingText}</h2>
                <ul role="list" className="space-y-2">
                    {taskList.map((task) => (
                        <TodoItem
                            key={task.id}
                            id={task.id}
                            name={task.name}
                            completed={task.completed}
                            onToggleCompleted={toggleTaskCompleted}
                            onRemove={removeTask}
                        />
                    ))}
                </ul>
            </section>

            {/* Grocery Panel Integration */}
            <GroceryPanel onAddTodo={addTask}/>
        </main>
    );
}

export default App;
