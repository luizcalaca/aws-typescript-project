import serverless from "serverless-http";
import express from "express";
import multer from "multer";
import { uploadController } from "./controllers/fileController";
const upload = multer({ dest: '/tmp/uploads/' });

const app = express();

app.post("/upload", upload.single('file'), uploadController);

export const handler = serverless(app);
