import express, { Request, Response } from "express";
import dotenv from "dotenv";
import {ValidRoutes} from "./shared/ValidRoutes"
import {connectMongo} from "./connectMongo";
import {ImageProvider} from "./providers/ImageProvider";
import {registerImageRoutes} from "./routes/imageRoutes";
import {registerAuthRoutes} from "./routes/authRoutes";
import {CredentialsProvider} from "./providers/CredentialsProvider";
import {verifyAuthToken} from "./tokenAuth";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.


const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";



const mongoClient = connectMongo()
const imageProvider = new ImageProvider(mongoClient)
const credentialsProvider = new CredentialsProvider(mongoClient)

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(STATIC_DIR));
const imageDir = process.env.IMAGE_UPLOAD_DIR
if (!imageDir) {
    throw new Error("Image directory doesn't exist");
}
app.use("/uploads", express.static(imageDir));

app.use("/api/*", verifyAuthToken);



registerImageRoutes(app,imageProvider);
registerAuthRoutes(app, credentialsProvider);


app.get("/api/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});
app.get(Object.values(ValidRoutes), (req: Request, res: Response) => {
    res.sendFile("index.html", {root: STATIC_DIR});
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


