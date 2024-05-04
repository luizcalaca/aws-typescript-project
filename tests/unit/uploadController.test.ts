import { uploadController } from '../../src/controllers/fileController';
import { Request, Response } from 'express';
import { s3 } from '../../src/services/fileService';

jest.mock('../../src/services/fileService', () => ({
  s3: {
    upload: jest.fn(),
  },
}));

export interface RequestWithFile extends Request {
    file?: Express.Multer.File;
  }

describe('uploadController', () => {
  it('should handle successful file upload', async () => {
    const mockRequest = {
      file: {
        fieldname: 'file',
        originalname: 'test.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        size: 1024,
      },
    } as unknown as RequestWithFile;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (s3.upload as jest.Mock).mockResolvedValue({
      Location: 'http://example.com/successful-upload.csv',
    });

    const uploadPromiseStub = jest.fn().mockResolvedValue({ Location: 'http://example.com/successful-upload.csv' });
    jest.spyOn(s3, 'upload').mockReturnValueOnce({ promise: uploadPromiseStub } as unknown as any);

    await uploadController(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Success!', ulr: 'http://example.com/successful-upload.csv' });
  });
});
