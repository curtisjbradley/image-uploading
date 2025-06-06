import {Collection, MongoClient} from "mongodb";
import * as process from "node:process";

interface IImageDocument {
    _id: string;
    src: string;
    name: string;
    authorId: string;
}

interface IUserDocument {
    _id: string;
    username: string;
    email: string;
}

export class ImageProvider {
    private imageCollection: Collection<IImageDocument>

    constructor(private readonly mongoClient: MongoClient) {
        const imageCollectionName = process.env.IMAGES_COLLECTION_NAME;
        if (!imageCollectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }
        this.imageCollection = this.mongoClient.db().collection(imageCollectionName);
    }

    getAllImages() {
        return this.imageCollection.aggregate([{$lookup: {
                from: "users",
                localField: "authorId",
                foreignField: "username",
                as: "authorData"
            }},
            {$unwind: "$authorData"}, {$project: {
                    "src": "$src",
                    "name": "$name",
                    "author.id": "$authorData._id",
                    "author.username": "$authorData.username"
                }}, {$project: {
                    _id: 0,
                    id: {$toString: "$_id"},
                    src: 1,
                    name: 1,
                    author: 1
                }}]).toArray();
    }

    updateImageName(id: string, newName: string) {
        return this.imageCollection.updateOne({_id: id}, {$set: {name: newName}})
    }
}