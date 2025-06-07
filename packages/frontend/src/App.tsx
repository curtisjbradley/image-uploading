import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import {Route, Routes} from "react-router";
import {MainLayout} from "./MainLayout.tsx";
import type { IApiImageData } from "csc437-monorepo-backend/src/shared/ApiImageData.ts";
import {useRef, useState} from "react";
import {ValidRoutes} from "csc437-monorepo-backend/src/shared/ValidRoutes.ts"
import {ImageSearchForm} from "./ImageSourceForm.tsx";
import {ProtectedRoute} from "./ProtectedRoute.tsx";




function App() {
    const [imageData, setImageData] = useState<IApiImageData[]>([]);
    const [imageDataLoading, setImageDataLoading] = useState<boolean>(true);
    const [imageDataError, setImageDataError] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [token, setToken] = useState<string>("")
    const reqId = useRef(0)

    function updateToken(newToken: string) {
        setToken(newToken)
        console.log("Fetching image data")
        setImageDataLoading(true)
        fetch("/api/images", { headers: {
                Authorization: `Bearer ${newToken}`}}).then(r => {
            if (!r.ok) {
                setImageDataError(true);
                console.log("Uh oh!");
                return
            }
            setImageDataLoading(false);
            setImageDataError(false);
            r.json().then(setImageData)
            console.log("Set image data")
        });

    }


    function handleImageSearch() {
        reqId.current = reqId.current + 1;
        const id = reqId.current;
        setImageDataLoading(true);
        setImageDataError(false)
        fetch(`/api/images?name=${searchQuery}`, {headers: {
            "Authorization": `Bearer ${token}`
            }}).then(r => {
            if (!r.ok) {
                setImageDataError(true);
                return;
            }
            r.json().then((data) => {
                if (id === reqId.current) {
                    setImageData(data)

                }
            })
        }).then(() => {
            setImageDataError(false)
        }
        ).catch(() => {
            setImageDataError(true)
        }).finally(() => {
            setImageDataLoading(false);
        })

    }
    const searchPanel = <ImageSearchForm searchString={searchQuery} onSearchStringChange={setSearchQuery} onSearchRequested={handleImageSearch}/>

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
                <Route element={<ProtectedRoute authToken={token}/>} >
                    <Route index element={<AllImages imageData={imageData} imageDataLoading={imageDataLoading} imageDataError={imageDataError} searchPanel={searchPanel}/>} />
                    <Route path={ValidRoutes.IMAGES} element={<ImageDetails token={token} imageData={imageData} imageDataLoading={imageDataLoading} imageDataError={imageDataError} updateImageName={updateImageName}/>} />
                    <Route path={ValidRoutes.UPLOAD} element={<UploadPage />} />
                </Route>
                <Route path={ValidRoutes.LOGIN} element={<LoginPage isRegistering={false} setToken={updateToken}/>} />
                <Route path={ValidRoutes.REGISTER} element={<LoginPage isRegistering={true} setToken={updateToken}/>} />
            </Route>
        </Routes>
    )
}


export default App;
