import type { Request, Response } from 'express';
import { getConfig } from '../../../config';
import { IFilesService } from './files.service';

export async function get(_req: Request, res: Response, filesService: IFilesService): Promise<void> {
    const fileUploadPath = getConfig().fileUploadPath;
    const files = await filesService.readDirectory(fileUploadPath);
    res.send(files);
}

export async function post(req: Request, res: Response, filesService: IFilesService): Promise<void> {
    await upload(req, res, filesService);
}

const upload = async (req: Request, res: Response, filesService: IFilesService) => {
    try {
      await filesService.uploadFile(req, res);
  
      if (!req.file) {
        return res.status(400).send({ message: 'Please upload a file!' });
      }
  
      return res.status(200).send({
        message: `Uploads success: ${req.file?.originalname}`,
      });
    } catch (err: any) {
      console.log(err);
  
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).send({
          message: `File size cannot be larger than ${getConfig().fileUploadMaxSizeMb}MB!`,
        });
      }
  
      return res.status(500).send({
        message: `Could not upload the file: ${req.file?.originalname}. ${err}`,
      });
    }
  };