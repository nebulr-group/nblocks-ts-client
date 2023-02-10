import { readFileSync } from 'fs';
import { FileClient } from './file';
import * as startUploadMock from '../../../test/start-upload-session-response.mock.json';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { NblocksClient } from '../nblocks-client';

describe('File client', () => {

    let fileClient: FileClient;
    
    let testFile = {file: "testFile.png", contentType: "image/png", location: "./test/testFile.png"};

    let uploadedKey: string;
    let persistedSignedUrl: string;

    let mockApi: MockAdapter;
    beforeAll(() => {
        const client = new NblocksClient("SECRET", 1, false, 'DEV');
        mockApi = new MockAdapter(client["httpClient"]);
        fileClient = client.tenant("1234").fileClient;
    });

    beforeEach(() => {
        mockApi.reset();
    });

    test('Start upload session', async () => {
        mockApi.onPost("/upload/prepare").reply(200, startUploadMock);
        const resp = await fileClient.startUploadSession({fileName: testFile.file, contentType: testFile.contentType})
        expect(resp.key).toBeDefined();
        expect(resp.session).toBeDefined();
    });

    test('Finish upload session', async () => {
        mockApi.onPost("/upload/finish").reply(200, "https://nebulr-file-api-stage-upload.s3.eu-west-1.amazonaws.com/624c14cc0c01e70033356282/624c14cc0c01e70033356285/05f71f5e-b1cc-42af-a8a5-8c4be7ee823c/aa866bce-311a-4f68-9166-e31311d48f99.png?AWSAccessKeyId=AKIA3CYOMUVTC5SPHAUK&Expires=1662477839&Signature=VgRMm7BgP40HhtjO%2F4Zmx31NH%2FI%3D");
        await fileClient.finishUploadSession({key: "624c14cc0c01e70033356282/624c14cc0c01e70033356285/05f71f5e-b1cc-42af-a8a5-8c4be7ee823c/aa866bce-311a-4f68-9166-e31311d48f99.png"})
    });

    // test('Get signed url', async () => {
    //     mockApi.onPost("/file/signedUrl").reply(200, "https://nebulr-file-api-stage-upload.s3.eu-west-1.amazonaws.com/624c14cc0c01e70033356282/624c14cc0c01e70033356285/05f71f5e-b1cc-42af-a8a5-8c4be7ee823c/aa866bce-311a-4f68-9166-e31311d48f99.png?AWSAccessKeyId=AKIA3CYOMUVTC5SPHAUK&Expires=1662477839&Signature=VgRMm7BgP40HhtjO%2F4Zmx31NH%2FI%3D");
    //     await fileClient.getSignedUrls(["624c14cc0c01e70033356282/624c14cc0c01e70033356285/05f71f5e-b1cc-42af-a8a5-8c4be7ee823c/aa866bce-311a-4f68-9166-e31311d48f99.png"]);
    // });

    // test('[persisted/private] Upload a file A-B', async () => {
    //     const file = readFileSync(testFile.location);
    //     const resp = await fileClient.uploadFile(file, testFile.file, testFile.contentType, {persist: true, publicFile: false});
    //     uploadedKey = resp.key;
    //     persistedSignedUrl = resp.signedUrl;
	//     console.log(`Uploaded a file: ${resp.key}`);
    //     // File should be available
    //     await axios.create().get(persistedSignedUrl);
    // });

    // test('[persisted/private] Upload a file A-B and remove metadata', async () => {
    //     const file = readFileSync(testFile.location);
    //     const resp = await fileClient.uploadFile(file, testFile.file, testFile.contentType, {persist: true, publicFile: false, removeMetaData: true});
    //     uploadedKey = resp.key;
    //     persistedSignedUrl = resp.signedUrl;
	//     console.log(`Uploaded a file: ${resp.key}`);
    //     // File should be available
    //     await axios.create().get(persistedSignedUrl);
    // });

    // test('[persisted/private] Get signed url for an Object', async () => {
    //     const response = await fileClient.getSignedUrls([uploadedKey]);
    //     expect(response).toHaveLength(1);
    // });

    // test('[persisted/private] Delete an Object', async () => {
    //     // File should be available
    //     await axios.create().get(persistedSignedUrl);
        
    //     await fileClient.delete({key: uploadedKey, publicFile: false});

    //     // File should NOT be available anymore
    //     const httpPromise = axios.create().get(persistedSignedUrl);
    //     await expect(httpPromise).rejects.toThrow();
    // });

    // test('[persisted/public] Upload a file A-B', async () => {
    //     const file = readFileSync(testFile.location);
    //     const resp = await fileClient.uploadFile(file, testFile.file, testFile.contentType, {persist: true, publicFile: true});
    //     uploadedKey = resp.key;
    //     persistedSignedUrl = resp.signedUrl;
	//     console.log(`Uploaded a file: ${resp.key}`);
    //     // File should be available
    //     await axios.create().get(persistedSignedUrl);
    // });

    // //TODO file should be publically available?
    // test('[persisted/public] Get signed url for an Object', async () => {
    //     const response = await fileClient.getSignedUrls([uploadedKey]);
    //     expect(response).toHaveLength(1);
    // });

    // test('[persisted/public] Delete an Object', async () => {
    //     // File should be available
    //     await axios.create().get(persistedSignedUrl);
        
    //     await fileClient.delete({key: uploadedKey, publicFile: false});

    //     // File should NOT be available anymore
    //     const httpPromise = axios.create().get(persistedSignedUrl);
    //     await expect(httpPromise).rejects.toThrow();
    // });
})
