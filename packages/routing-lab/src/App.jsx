import { Routes, Route } from "react-router";
import { useState } from "react";
import { Homepage } from "./Homepage.jsx";
import { AccountSettings } from "./AccountSettings.jsx";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { MainLayout } from "./MainLayout.jsx";
import { useImageFetching } from "./images/useImageFetching.js";

function App() {
    const [userName, setUserName] = useState("John Doe");
    const [isChecked, setIsChecked] = useState(false);

    const { fetchedImages, isLoading } = useImageFetching("");

    return (
        <Routes>
            <Route path="/" element={<MainLayout isChecked={isChecked} setIsChecked={setIsChecked} />}>
                <Route index element={<Homepage userName={userName} />} />
                <Route path="images" element={<ImageGallery fetchedImages={fetchedImages} isLoading={isLoading} />} />
                <Route path="images/:imageId" element={<ImageDetails fetchedImages={fetchedImages} />} />
                <Route path="account" element={<AccountSettings userName={userName} setUserName={setUserName} />} />
            </Route>
        </Routes>
    );
}

export default App;
