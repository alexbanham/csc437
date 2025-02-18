import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Tailwind applied here

// Task Data
const DATA = [
    { id: "todo-0", name: "Eat", completed: true },
    { id: "todo-1", name: "Sleep", completed: false },
    { id: "todo-2", name: "Repeat", completed: false },
];

// Render App with DATA
ReactDOM.createRoot(document.getElementById("root")).render(<App tasks={DATA} />);
