interface Config {
    fileUploadPath: string;
    fileUploadMaxSizeMb: number;
}

export function getConfig(): Config {
    return {
        fileUploadPath: process.env['FILE_UPLOAD_PATH'] || 'files',
        fileUploadMaxSizeMb: Number(process.env['FILE_UPLOAD_MAX_SIZE_MB']) || 100
    };
}