import express, {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {ImageProvider} from "../providers/ImageProvider";

const MAX_NAME_LENGTH = 100

export function registerImageRoutes(app: express.Application, imageProvider: ImageProvider) {

    app.get("/api/images",(req : Request,res : Response) => {

        waitRandom().then(() => {
            if(!req.query?.name) {
                imageProvider.getAllImages().then(images => res.status(200).json(images))
                return;
            }
            const key = req.query.name;
            imageProvider.getAllImages().then((images) => {
                return images.filter((image) => {
                    return image.name.toLowerCase().startsWith(key.toString().toLowerCase());
                })
            }).then((images) => {res.status(200).send(images)}).catch((err) => {
                res.status(500).send(err.message);
            });
        })

    })


//For renaming images
    app.put("/api/images/:id", (req: Request, res : Response) => {
        waitRandom().then(() => {
            if(req.params.id === undefined || !ObjectId.isValid(req.params.id)) {
                res.status(404).send({
                    error: "Not Found",
                    message: "Image does not exist"
                });
                return;
            }

            if(!req.body?.name) {
                res.status(400).send({
                    error: "Bad Request",
                    message: "Missing a body with a name field"
                });
                return;
            }
            if(req.body.name.length > 100){
                res.status(422).send({
                    error: "Unprocessable Entity",
                    message: `Image name exceeds ${MAX_NAME_LENGTH} characters`
                });
                return;
            }
            imageProvider.getOwner(req.params.id).then((owner) => {
                if(owner != req.user?.username){
                    res.status(403).send("Unauthorized");
                    return;
                }
                imageProvider.updateImageName(req.params.id, req.body.name).then(() => res.status(204).end())
            }).catch((err) => {
                res.status(500).json({message: err.message});
            })

        })

    })

    function waitRandom(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, Math.random()*5000));
    }

}