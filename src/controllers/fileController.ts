import { Request, Response } from 'express';
import { s3 } from '../services/fileService'
import { randomUUID } from 'crypto';
import config from '../../config.json'

export interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

export const uploadController = async (req: RequestWithFile, res: Response) => {
  const file = req.file;

  const params = {
    Bucket: config.S3_BUCKET_NAME,
    Key:  `upload-to-s3/${randomUUID()}.csv`,
    Body: file
  };

  try {
    if (!file) 
      return res.status(400).send('No files were uploaded.');

    const data = await s3.upload(params).promise();
    return res.status(200).json({ message: 'Success!', ulr: data.Location});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error with upload' });
  }
};
