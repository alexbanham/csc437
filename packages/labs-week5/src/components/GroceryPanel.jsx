import React, { useState } from "react";
import { Spinner } from "./Spinner";

const MDN_URL = "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json";

/**
 * Creates and returns a new promise that resolves after a specified number of milliseconds.
 *
 * @param {number} ms the number of milliseconds to delay
 * @returns {Promise<undefined>} a promise that resolves with the value of `undefined` after the specified delay
 */
function delayMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function GroceryPanel({ onAddTodo }) {
    const [groceryData, setGroceryData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fetchData(url) {
        console.log("Fetching data from " + url);
        setIsLoading(true);
        setError(null);
        setGroceryData([]); // Clear current data

        try {
            await delayMs(2000); // Simulate delay
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const data = await response.json();
            setGroceryData(data);
        } catch (err) {
            setError("Failed to fetch data.");
        } finally {
            setIsLoading(false);
        }
    }

    function handleDropdownChange(event) {
        const selectedUrl = event.target.value;
        if (selectedUrl === "") {
            setGroceryData([]);
            setError(null);
            return;
        }
        fetchData(selectedUrl);
    }

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
                    className="border border-gray-300 p-1 rounded-sm disabled:opacity-50"
                    onChange={handleDropdownChange}
                    disabled={isLoading}
                >
                    <option value="">(None selected)</option>
                    <option value={MDN_URL}>MDN</option>
                    <option value="invalid">Who knows?</option>
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
