import { useEffect, useState } from "react";

export function useImageFetching(authToken, imageId = "") {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchedImages, setFetchedImages] = useState([]);

    useEffect(() => {
        async function fetchImages() {
            try {
                console.log("🔍 Fetching images from backend...");
                const headers = authToken ? { "Authorization": `Bearer ${authToken}` } : {};
                const response = await fetch("/api/images", { headers });
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                let data = await response.json();
                // Map backend _id to id so that React keys work as expected
                data = data.map(image => ({
                    ...image,
                    id: image._id ? image._id : image.id
                }));
                if (imageId) {
                    data = data.filter(img => img.id === imageId);
                }
                setFetchedImages(data);
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchImages();
    }, [authToken, imageId]);

    return { isLoading, fetchedImages };
}
