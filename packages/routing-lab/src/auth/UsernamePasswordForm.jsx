import React from "react";
import { useActionState } from "react";

export function UsernamePasswordForm({ onSubmit }) {
    const [result, submitAction, isPending] = useActionState(
        async (previousState, formData) => {
            const username = formData.get("username");
            const password = formData.get("password");

            if (!username || !password) {
                return {
                    type: "error",
                    message: "Please fill in your username and password"
                };
            }
            // Delegate submission to the parent-provided handler.
            return await onSubmit({ username, password });
        },
        null
    );

    return (
        <div>
            {result && (
                <p style={{ color: result.type === "error" ? "red" : "green" }}>
                    {result.message}
                </p>
            )}
            {isPending && <p>Loading...</p>}
            <form action={submitAction}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" disabled={isPending} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" disabled={isPending} />
                </div>
                <button type="submit" disabled={isPending}>Submit</button>
            </form>
        </div>
    );
}
