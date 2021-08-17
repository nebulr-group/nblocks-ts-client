import * as testData from '../../../test/testData.json'
import {PlatformClient, Stage} from '../platform-client'
import { readFileSync } from 'fs';
import { FileClient } from './file';
import axios, { AxiosError } from 'axios';

describe('File client', () => {

    let fileClient: FileClient;
    
    let testFile = {file: "testFile.png", contentType: "image/png", location: "./test/testFile.png"};

    let uploadedKey: string;
    let persistedSignedUrl: string;

    beforeAll(() => {
        fileClient = new PlatformClient(testData.API_KEY, 1, false, testData.STAGE as Stage).tenant(testData.TENANT).fileClient;
    });

    test('Start upload session', async () => {
        const resp = await fileClient.startUploadSession({fileName: testFile.file, contentType: testFile.contentType})
        expect(resp.key).toBeDefined();
        expect(resp.session).toBeDefined();
    });

    // test('Finish upload session', async () => {
    //     const resp = fileClient.finishUploadSession({})
    //     console.log(resp);
    // });

    test('Upload a file A-B', async () => {
        const file = readFileSync(testFile.location);
        const resp = await fileClient.uploadFile(file, testFile.file, testFile.contentType, true);
        uploadedKey = resp.key;
        persistedSignedUrl = resp.signedUrl;
	    console.log(`Uploaded a file: ${resp.key}`);
        // File should be available
        await axios.create().get(persistedSignedUrl);
    });

    test('Get signed url for an Object', async () => {
        const response = await fileClient.getSignedUrls([uploadedKey]);
        expect(response).toHaveLength(1);
    });

    test('Delete an Object', async () => {
        // File should be available
        await axios.create().get(persistedSignedUrl);
        
        await fileClient.delete(uploadedKey);

        // File should NOT be available anymore
        const httpPromise = axios.create().get(persistedSignedUrl);
        expect(httpPromise).rejects.toThrow();
    });
})
