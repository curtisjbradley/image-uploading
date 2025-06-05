import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import {Route, Routes} from "react-router";
import {MainLayout} from "./MainLayout.tsx";
import {fetchDataFromServer, type IImageData} from "./MockAppData.ts";
import {useState} from "react";
import {ValidRoutes} from "csc437-monorepo-backend/src/shared/ValidRoutes.ts"

function App() {
    const [imageData, _setImageData] = useState<IImageData[]>(fetchDataFromServer);
    return (
        <Routes>
            <Route path={ValidRoutes.HOME} element={<MainLayout />}>
                <Route index element={<AllImages imageData={imageData} />} />
                <Route path={ValidRoutes.IMAGES} element={<ImageDetails imageData={imageData}/>} />
                <Route path={ValidRoutes.UPLOAD} element={<UploadPage />} />
                <Route path={ValidRoutes.LOGIN} element={<LoginPage />} />
            </Route>
        </Routes>
    )
}

export default App;
