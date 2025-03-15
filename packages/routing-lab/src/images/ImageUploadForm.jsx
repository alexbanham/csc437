import React, { useState, useId } from "react";
import { useActionState } from "react";

// Helper function to convert a File object to a data URL
function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = (err) => reject(err);
        fr.readAsDataURL(file);
    });
}

export function ImageUploadForm({ authToken }) {
    const uniqueId = useId();
    const fileInputId = `${uniqueId}-file`;
    const titleInputId = `${uniqueId}-title`;

    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // useActionState handles form submission and state for loading/error messages.
    const [result, submitAction, isPending] = useActionState(
        async (prevState, formData) => {
            const file = formData.get("image");
            const title = formData.get("name");

            if (!file || file.size === 0 || !title) {
                return {
                    type: "error",
                    message: "Please select an image file and provide a title."
                };
            }

            try {
                const response = await fetch("/api/images", {
                    method: "POST",
                    body: formData,
                    headers: {
                        // Do not manually set Content-Type when sending FormData.
                        ...(authToken && { "Authorization": `Bearer ${authToken}` })
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    return { type: "error", message: errorData.message || "Upload failed" };
                }
                return { type: "success", message: "Image uploaded successfully" };
            } catch (error) {
                console.error("Upload error:", error);
                return { type: "error", message: "Network error during upload" };
            }
        },
        null
    );

    // Handle file selection and generate a preview
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file) {
            try {
                const dataUrl = await readAsDataURL(file);
                setPreview(dataUrl);
            } catch (err) {
                console.error(err);
                setPreview(null);
            }
        } else {
            setPreview(null);
        }
    };

    return (
        <form action={submitAction}>
            <div>
                <label htmlFor={fileInputId}>Choose image to upload:</label>
                <input
                    id={fileInputId}
                    name="image"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    disabled={isPending}
                />
            </div>
            <div>
                <label htmlFor={titleInputId}>
                    <span>Image title: </span>
                    <input id={titleInputId} name="name" type="text" disabled={isPending} />
                </label>
            </div>
            <div>
                {/* Preview image element */}
                <img
                    style={{ maxWidth: "20em" }}
                    src={preview || ""}
                    alt={preview ? "Image preview" : "No image selected"}
                />
            </div>
            <button type="submit" disabled={isPending}>Confirm upload</button>
            {result && (
                <p style={{ color: result.type === "error" ? "red" : "green" }}>
                    {result.message}
                </p>
            )}
            {isPending && <p>Uploading...</p>}
        </form>
    );
}
