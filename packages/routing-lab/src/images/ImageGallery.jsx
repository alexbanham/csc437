import { Link } from "react-router";
import "./ImageGallery.css";
import { ImageUploadForm } from "./ImageUploadForm.jsx";

export function ImageGallery({ fetchedImages, isLoading, authToken }) {
    if (isLoading) return <p>Loading...</p>;
    if (!fetchedImages || fetchedImages.length === 0) {
        console.log("⚠ No images found!");
        return <p>No images found.</p>;
    }

    return (
        <div>
            <h2>Image Gallery</h2>
            <h3>Upload a New Image</h3>
            <ImageUploadForm authToken={authToken} />
            <div className="ImageGallery">
                {fetchedImages.map((image) => (
                    <div key={image.id} className="ImageGallery-photo-container">
                        <Link to={`/images/${image.id}`}>
                            <img src={image.src} alt={image.name} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
