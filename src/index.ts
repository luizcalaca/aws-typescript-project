import serverless from "serverless-http";
import express, { Request, Response} from "express";
import multer from "multer";
import { uploadController } from "./controllers/fileController";
const upload = multer({ dest: 'uploads/' });

const app = express();

app.post("/upload", upload.single('file'), uploadController);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.use((req: Request, res: Response) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);
