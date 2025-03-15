import { useState } from "react";

export function ImageEditForm({ authToken }) {
    const [imageId, setImageId] = useState("");
    const [imageName, setImageName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    console.log("Auth token in ImageEditForm:", authToken);
    async function handleSubmit() {
        setIsLoading(true);
        setMessage("");
        try {
            // Build headers including the auth token if provided
            const headers = {
                "Content-Type": "application/json",
                ...(authToken && { "Authorization": `Bearer ${authToken}` })
            };

            const response = await fetch(`/api/images/${imageId}`, {
                method: "PATCH",
                headers,
                body: JSON.stringify({ name: imageName })
            });

            if (response.status === 204) {
                setMessage("Image updated successfully!");
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error updating image:", error);
            setMessage("Error updating image.");
        } finally {
            setImageId("");
            setImageName("");
            setIsLoading(false);
        }
    }

    return (
        <div>
            <label style={{ display: "block" }}>
                Image ID
                <input
                    value={imageId}
                    disabled={isLoading}
                    onChange={(e) => setImageId(e.target.value)}
                />
            </label>
            <label style={{ display: "block" }}>
                New image name
                <input
                    value={imageName}
                    disabled={isLoading}
                    onChange={(e) => setImageName(e.target.value)}
                />
            </label>
            <button disabled={isLoading} onClick={handleSubmit}>
                Send request
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}
