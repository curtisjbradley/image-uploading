import { ImageGrid } from "./ImageGrid.tsx";
import type { IApiImageData } from "csc437-monorepo-backend/src/shared/ApiImageData.ts";

export interface IImageDataProps {
    imageData: IApiImageData[];
    imageDataLoading: boolean;
    imageDataError: boolean;
}

export function AllImages(props: Readonly<IImageDataProps>) {

    return (
        <div>
            <h2>All Images</h2>
            {props.imageDataLoading && <div>Loading...</div>}
            {props.imageDataError && <div>Error Fetching Images</div>}
            <ImageGrid images={props.imageData} />
        </div>
    );
}
