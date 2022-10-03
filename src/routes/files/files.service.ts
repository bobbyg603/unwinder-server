import { Request, Response } from 'express';
import { readdir } from 'fs/promises';
import { uploadFile } from '../../middleware/upload';

export interface IFilesService {
    readDirectory: (path: string) => Promise<Array<string>>;
    uploadFile: (req: Request, res: Response) => Promise<void>;
}

export class FilesService implements IFilesService {
    async readDirectory(path: string) {
        return await readdir(path);
    }

    async uploadFile(req: Request, res: Response): Promise<void> {
        return uploadFile(req, res);
    }
}
