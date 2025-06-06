import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import {Route, Routes} from "react-router";
import {MainLayout} from "./MainLayout.tsx";
import type { IApiImageData } from "csc437-monorepo-backend/src/shared/ApiImageData.ts";
import {useEffect, useState} from "react";
import {ValidRoutes} from "csc437-monorepo-backend/src/shared/ValidRoutes.ts"




function App() {
    const [imageData, setImageData] = useState<IApiImageData[]>([]);
    const [imageDataLoading, setImageDataLoading] = useState<boolean>(true);
    const [imageDataError, setImageDataError] = useState<boolean>(false);

    useEffect(() => {
        console.log("Fetching image data")
        setImageDataLoading(true)
        fetch("/api/images").then(r => {
            if (!r.ok) {
                setImageDataError(true);
                console.log("Uh oh!");
                return
            }
            setImageDataLoading(false);
            setImageDataError(false);
            r.json().then(setImageData)
        })    }, []);
    function updateImageName(id: string, newName: string) {
        const image = imageData.find(i => i.id === id)
        const newImageData = imageData.slice();
        if (image) {
            const index = newImageData.indexOf(image)
            newImageData[index].name = newName;
        }
        setImageData(newImageData)
    }
    return (
        <Routes>
            <Route path={ValidRoutes.HOME} element={<MainLayout />}>
                <Route index element={<AllImages imageData={imageData} imageDataLoading={imageDataLoading} imageDataError={imageDataError}/>}  />
                <Route path={ValidRoutes.IMAGES} element={<ImageDetails imageData={imageData} imageDataLoading={imageDataLoading} imageDataError={imageDataError} updateImageName={updateImageName}/>} />
                <Route path={ValidRoutes.UPLOAD} element={<UploadPage />} />
                <Route path={ValidRoutes.LOGIN} element={<LoginPage />} />
            </Route>
        </Routes>
    )
}


export default App;
