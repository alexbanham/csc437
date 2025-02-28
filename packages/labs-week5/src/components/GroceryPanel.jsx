import React, { useState } from "react";
import { useGroceryFetch } from "./useGroceryFetch";
import {Spinner} from "./Spinner.jsx";

export function GroceryPanel({ onAddTodo }) {
    const [selectedSource, setSelectedSource] = useState("MDN");
    const { groceryData, isLoading, error } = useGroceryFetch(selectedSource);

    function handleAddTodoClicked(item) {
        const todoName = `Buy ${item.name} ($${item.price.toFixed(2)})`;
        onAddTodo(todoName);
    }

    return (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h1 className="text-xl font-bold mb-2">Groceries Prices Today</h1>
            <label className="mb-4 flex gap-4 items-center">
                Get prices from:
                <select
                    className="border border-gray-300 p-1 rounded-sm"
                    onChange={(e) => setSelectedSource(e.target.value)}
                    value={selectedSource}
                >
                    <option value="MDN">MDN</option>
                    <option value="Liquor store">Liquor store</option>
                    <option value="Butcher">Butcher</option>
                    <option value="whoknows">Who knows?</option>
                </select>
                {isLoading && <Spinner />}
                {error && <span className="text-red-500 ml-2">{error}</span>}
            </label>

            {groceryData.length > 0 ? (
                <PriceTable items={groceryData} onAddClicked={handleAddTodoClicked} />
            ) : (
                !error && "No data"
            )}
        </div>
    );
}

function PriceTable({ items, onAddClicked }) {
    return (
        <table className="mt-4 w-full border-collapse border border-gray-300">
            <thead>
            <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
            </thead>
            <tbody>
            {items.map(item => (
                <PriceTableRow key={item.name} item={item} onAddClicked={() => onAddClicked(item)} />
            ))}
            </tbody>
        </table>
    );
}

function PriceTableRow({ item, onAddClicked }) {
    return (
        <tr>
            <td className="border border-gray-300 px-4 py-2">{item.name}</td>
            <td className="border border-gray-300 px-4 py-2">${item.price.toFixed(2)}</td>
            <td className="border border-gray-300 px-4 py-2">
                <button
                    className="italic px-2 rounded-sm border border-gray-300 hover:bg-gray-100 active:bg-gray-200 cursor-pointer whitespace-nowrap"
                    onClick={onAddClicked}
                >
                    Add to todos
                </button>
            </td>
        </tr>
    );
}
