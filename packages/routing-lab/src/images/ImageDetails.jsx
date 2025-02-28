import { useParams } from "react-router";

export function ImageDetails({ fetchedImages }) {
    const { imageId } = useParams();
    console.log(`🔍 Looking for image ID: ${imageId} in`, fetchedImages);

    if (!fetchedImages || fetchedImages.length === 0) {
        console.log("⚠ No images available to search!");
        return <p>Loading...</p>;
    }

    const imageData = fetchedImages.find((image) => image.id.toString() === imageId);

    if (!imageData) {
        console.log(`⚠ No image found for ID: ${imageId}`);
        return <h2>Image not found</h2>;
    }

    return (
        <div>
            <h2>{imageData.name}</h2>
            <img className="ImageDetails-img" src={imageData.src} alt={imageData.name} />
        </div>
    );
}
