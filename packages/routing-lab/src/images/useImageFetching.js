import { useEffect, useState } from "react";

const IMAGES = [
    { id: "0", src: "https://upload.wikimedia.org/wikipedia/commons/3/33/Blue_merle_koolie_short_coat_heading_sheep.jpg", name: "Blue merle herding sheep" },
    { id: "1", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Huskiesatrest.jpg/2560px-Huskiesatrest.jpg", name: "Huskies" },
    { id: "2", src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Taka_Shiba.jpg", name: "Shiba" },
    { id: "3", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Felis_catus-cat_on_snow.jpg/2560px-Felis_catus-cat_on_snow.jpg", name: "Tabby cat" },
    { id: "4", src: "https://upload.wikimedia.org/wikipedia/commons/8/84/Male_and_female_chicken_sitting_together.jpg", name: "Chickens" }
];

export function useImageFetching(imageId = "", delay = 1000) {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchedImages, setFetchedImages] = useState(IMAGES); // ✅ Initialize with IMAGES to avoid unnecessary re-fetching

    useEffect(() => {
        console.log("🔍 Fetching images..."); // ✅ Debugging log (should appear once)

        if (fetchedImages.length > 0) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setFetchedImages(imageId ? IMAGES.filter(img => img.id === imageId) : IMAGES);
            setIsLoading(false);
        }, delay);
    }, []); // ✅ Empty dependency array means it runs ONLY ONCE

    return { isLoading, fetchedImages };
}
