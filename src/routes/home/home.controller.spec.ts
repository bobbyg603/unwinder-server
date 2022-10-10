import { mock } from 'jest-mock-extended';
import { controller } from './home.controller';
import type { Request, Response } from 'express';

describe('HomeController', () => {
    it('should call send with welcome message', () => {
        const fakeRequest = mock<Request>({});
        const fakeResponse = mock<Response>();

        controller(fakeRequest, fakeResponse);

        expect(fakeResponse.send).toHaveBeenCalledWith(
            expect.stringMatching(/Welcome/)
        );
    });
});