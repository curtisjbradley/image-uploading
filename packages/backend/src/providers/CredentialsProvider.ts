import { Collection, MongoClient } from "mongodb";
import bcrypt from "bcrypt";

interface ICredentialsDocument {
    username: string;
    password: string;
}

export class CredentialsProvider {
    private readonly collection: Collection<ICredentialsDocument>;

    constructor(mongoClient: MongoClient) {
        const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
        if (!COLLECTION_NAME) {
            throw new Error("Missing CREDS_COLLECTION_NAME from env file");
        }
        this.collection = mongoClient.db().collection<ICredentialsDocument>(COLLECTION_NAME);
    }

    getAllUsers() {
        return this.collection.find().toArray()
    }

    async registerUser(username: string, plaintextPassword: string) {

        return await bcrypt.hash(plaintextPassword,10).then(hash => {
            if(!hash){
                throw new Error("Could not hash the password");
            }
            this.collection.insertOne({username: username, password: hash})
            return true;
        }).finally(() => {
                return false;
        })
    }

    async verifyPassword(username: string, plaintextPassword: string) {
        const selectedUser = await this.collection.findOne({username: username})
        if(!selectedUser){
            return false;
        }

        return await bcrypt.compare(plaintextPassword, selectedUser.password)

    }
}
