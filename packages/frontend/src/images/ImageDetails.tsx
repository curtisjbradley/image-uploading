import {useParams} from "react-router";
import {type ReactNode} from "react";
import type { IApiImageData } from "csc437-monorepo-backend/src/shared/ApiImageData.ts";
import {ImageNameEditor} from "../ImageNameEditor.tsx";

export interface IImageDataProps {
    imageData: IApiImageData[];
    imageDataLoading: boolean;
    imageDataError: boolean;
    updateImageName: (id: string, newName: string) => void;
}
export function ImageDetails(props: Readonly<IImageDataProps>): ReactNode {
    const {imageId} = useParams()
    const image = props.imageData.find(image => image.id == imageId);


    if(props.imageDataLoading) {
        return(<h2>Loading Images</h2>)
    }
    if(props.imageDataError) {
        return(<h2>Could not load images</h2>)
    }
    if(!image) {
        return (<h2>Image not found</h2>)
    }
    return (
        <div>

            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <img className="ImageDetails-img" src={image.src} alt={image.name}/>
            <ImageNameEditor initialValue={image.name} imageId={imageId || ""}  handleUpdate={props.updateImageName}/>
        </div>
    )
}
