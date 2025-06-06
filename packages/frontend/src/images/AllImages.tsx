import { ImageGrid } from "./ImageGrid.tsx";
import type { IApiImageData } from "csc437-monorepo-backend/src/shared/ApiImageData.ts";
import type {ReactNode} from "react";

export interface IImageDataProps {
    imageData: IApiImageData[];
    imageDataLoading: boolean;
    imageDataError: boolean;
    searchPanel: ReactNode;
}

export function AllImages(props: Readonly<IImageDataProps>) {

    return (
        <div>
            {props.searchPanel}
            <h2>All Images</h2>
            {props.imageDataLoading && <div>Loading...</div>}
            {props.imageDataError && <div>Error Fetching Images</div>}
            {!props.imageDataLoading && props.imageData.length === 0 && <div>Image Not Found</div>}
            {!props.imageDataLoading && < ImageGrid images={props.imageData} />}
        </div>
    );
}
