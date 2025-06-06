import {Collection, MongoClient, ObjectId} from "mongodb";

interface IImageDocument {
    _id: ObjectId;
    src: string;
    name: string;
    authorId: string;
}

interface IUserDocument {
    _id: ObjectId;
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
        console.log("Update image name", id, newName);
        return this.imageCollection.updateOne({_id: new ObjectId(id)}, {$set: {name: newName}})
    }
}