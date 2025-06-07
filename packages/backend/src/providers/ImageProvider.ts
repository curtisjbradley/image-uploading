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
        return this.imageCollection.find().toArray();
    }

    updateImageName(id: string, newName: string) {
        console.log("Update image name", id, newName);
        return this.imageCollection.updateOne({_id: new ObjectId(id)}, {$set: {name: newName}})
    }

    getOwner(imageId: string) {
        return this.imageCollection.findOne({_id: new ObjectId(imageId)}).then(image => image?.authorId)
    }

    uploadImage(fileLocation: string, name: string, owner: string) {
        return this.imageCollection.insertOne({_id: new ObjectId(), src: fileLocation, name: name, authorId: owner})
    }
}