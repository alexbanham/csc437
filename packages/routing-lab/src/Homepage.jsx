import { ImageEditForm } from "./images/ImageEditForm.jsx";

export function Homepage({ userName, authToken }) {
    return (
        <div>
            <h2>Welcome, {userName}</h2>
            <p>This is the content of the home page.</p>
            <ImageEditForm authToken={authToken} />
        </div>
    );
}
