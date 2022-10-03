import { get, post } from './files.controller';

describe('FilesController', () => {
    let fakeFiles: any;
    let fakeFilesService: any;
    let fakeResponse: any;

    beforeEach(() => {
        fakeFilesService = {
            readDirectory: jest.fn(),
            uploadFile: jest.fn()
        };
        fakeFiles = ['sweet', 'emotion'];
        fakeFilesService.readDirectory.mockResolvedValue(fakeFiles);
        fakeFilesService.uploadFile.mockResolvedValue();

        fakeResponse = {
            send: jest.fn(),
            status: jest.fn()
        };
        fakeResponse.status.mockReturnValue(fakeResponse);
    });

    describe('get', () => {
        let fileUploadPath: any;

        beforeEach(async () => {
            const fakeRequest = {} as any;
            fileUploadPath = 'ramblin\' man';
            process.env['FILE_UPLOAD_PATH'] = fileUploadPath;

            await get(fakeRequest, fakeResponse, fakeFilesService);
        });

        it('should call readDirectory with fileUploadPath', () => {
            expect(fakeFilesService.readDirectory).toHaveBeenCalledWith(fileUploadPath);
        });

        it('should call send with array of uploaded files', () => {
            expect(fakeResponse.send).toHaveBeenCalledWith(fakeFiles);
        });
    });

    describe('post', () => {
        it('should call uploadFile with req and res', async () => {
            const fakeRequest = { song: 'beast of burden' } as any;

            await post(fakeRequest, fakeResponse, fakeFilesService);

            expect(fakeFilesService.uploadFile).toHaveBeenCalledWith(fakeRequest, fakeResponse);
        });

        it('should return 400 if no file is attached', async () => {
            const fakeRequest = { song: 'more than a feeling' } as any;

            await post(fakeRequest, fakeResponse, fakeFilesService);

            expect(fakeResponse.status).toHaveBeenCalledWith(400);
            expect(fakeResponse.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Please upload a file!'
                })
            );
        });

        it('should return 200 if upload succeeds', async () => {
            const fakeRequest = {
                file: {
                    originalname: 'doge.jpg'
                }
            } as any;

            await post(fakeRequest, fakeResponse, fakeFilesService);

            expect(fakeResponse.status).toHaveBeenCalledWith(200);
            expect(fakeResponse.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: `Uploads success: ${fakeRequest.file?.originalname}`,
                })
            );
        });

        describe('error', () => {
            it('should return 400 if file is too big', async () => {
                const fileUploadMaxSizeMb = 123;
                const fakeRequest = { song: 'bad moon rising' } as any;
                const error = {
                    ...new Error('bugsplat!'),
                    code: 'LIMIT_FILE_SIZE'
                };
                fakeFilesService.uploadFile.mockImplementation(() => { throw error });
                process.env['FILE_UPLOAD_MAX_SIZE_MB'] = `${fileUploadMaxSizeMb}`;

                await post(fakeRequest, fakeResponse, fakeFilesService);

                expect(fakeResponse.status).toHaveBeenCalledWith(400);
                expect(fakeResponse.send).toHaveBeenCalledWith(
                    expect.objectContaining({
                        message: `File size cannot be larger than ${fileUploadMaxSizeMb}MB!`
                    })
                );
            });

            it('should return 500 with message for all other errors', async () => {
                const fakeRequest = {
                    file: {
                        originalname: 'doge.jpg'
                    }
                } as any;
                const error = new Error('bugsplat!');
                fakeFilesService.uploadFile.mockImplementation(() => { throw error });

                await post(fakeRequest, fakeResponse, fakeFilesService);

                expect(fakeResponse.status).toHaveBeenCalledWith(500);
                expect(fakeResponse.send).toHaveBeenCalledWith(
                    expect.objectContaining({
                        message: `Could not upload the file: ${fakeRequest.file?.originalname}. ${error}`,
                    })
                );
            });
        });
    });
});