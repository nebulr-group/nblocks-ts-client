import { Client } from '../../abstracts/client';
import * as FormData from 'form-data'
import axios from 'axios';
import { Tenant } from '../tenant/tenant';
import { PrepareUploadArgs } from './models/prepare-upload-args';
import { PrepareUploadRequestDto } from './models/prepare-upload-request.dto';
import { CreatePresignedPostResponseDto } from './models/create-presigned-post-response.dto';
import { FinishUploadArgs } from './models/finish-upload-args';
import { FinishUploadRequestDto } from './models/finish-upload-request.dto';
import { DeleteFileArgs } from './models/delete-file-args';
import { DeleteFileRequestDto } from './models/delete-file-request.dto';
import { CreateZipArgs } from './models/create-zip-args';
import { CreateZipRequestDto } from './models/create-zip-request.dto';

export class FileClient extends Client {

  readonly tenantId: string;

  private readonly BASE_URLS = {
    'PROD':'https://file-api.nebulr-core.com',
    'STAGE':'https://file-api-stage.nebulr-core.com',
    'DEV':'http://file-api:3000'
  };

  constructor (parentEntity: Tenant, debug = false) {
    super(parentEntity, debug);
    this.tenantId = parentEntity.id;
  }

  /**
   * Starts an uploading session that securely shared with an end users that could initiated a HTTP Post upload themselves from browser
   * The response contains all headers required to perform a fast and secure upload
   * The session is just valid for a short time
   * @param args 
   * @returns 
   */
  async startUploadSession(args: PrepareUploadArgs): Promise<{key: string, session: CreatePresignedPostResponseDto}> {
    const reqArgs: PrepareUploadRequestDto = {...args, tenantId: this.tenantId};
    const session = (await this.getHttpClient().post<CreatePresignedPostResponseDto>(`upload/prepare`, reqArgs, { headers: this.getHeaders(), baseURL: this._getBaseUrl()})).data;
    return {key: session.fields['key'], session};
  }

  /**
   * Mark the uploading session as finished and returns a signed URL for temporary access to the object
   * Don't forget to provide `persist:true` if you wish to have the object saved. Otherwise the object will expire within 24h
   * If the uploaded file is an image, two thumbnails will be created alongside for later retrieval
   * @param args 
   * @returns 
   */
  async finishUploadSession(args: FinishUploadArgs): Promise<string> {
    const reqArgs: FinishUploadRequestDto = {...args, tenantId: this.tenantId};
    return (await this.getHttpClient().post<string>(`upload/finish`, reqArgs, { headers: this.getHeaders(), baseURL: this._getBaseUrl()})).data;
  }

  /**
   * Get signed URLs for temporary access to objects saved before
   * @param keys 
   * @returns 
   */
  async getSignedUrls(keys: string[]): Promise<string []> {
    return (await this.getHttpClient().post<string []>(`file/signedUrl`, {keys, tenantId: this.tenantId}, { headers: this.getHeaders(), baseURL: this._getBaseUrl()})).data;
  }

  /**
   * Delete an object from storage
   * @param args 
   * @returns 
   */
  async delete(args: DeleteFileArgs): Promise<void> {
    const reqArgs: DeleteFileRequestDto = { ...args, tenantId: this.tenantId };
    return (await this.getHttpClient().post(`file/delete`, reqArgs, { headers: this.getHeaders(), baseURL: this._getBaseUrl() })).data;
  }

  /**
   * Uploads a file straight to cloud storage by wrapping the calls `startUploadSession`, `finishUploadSession` and doing a HTTP Post upload in the middle.
   * @param file The file containing a filename, contentType and data
   * @param persist if you wish to have the object saved. Otherwise the object will expire within 24h
   * @returns Returns a signed URL for temporary access to the object
   */
   async uploadFile(file: Buffer, fileName: string, contentType: string, options: Pick<FinishUploadArgs, 'persist' | 'publicFile' | 'removeMetaData'>): Promise<{key: string, signedUrl: string}> {
    const uploadSession = await this.startUploadSession({fileName, contentType});

    // The code and customer Content-Length generation within the try catch block is based on the discussion here https://github.com/axios/axios/issues/1006
    try {
      // Construct upload request
      const sessionFields = uploadSession.session.fields;
      const formData: FormData = new FormData();
      for (const key of Object.keys(sessionFields)) {
        formData.append(key, sessionFields[key]);
      }
      formData.append('file', file, {filename: fileName, contentType});
      const contentLength:number = await new Promise((resolve, reject) => {
        formData.getLength((err, length) => {
            if(err) { reject(err); }
          resolve(length);
        });
      });

    await axios.create().post(uploadSession.session.url, formData, {headers: {...formData.getHeaders(), 'Content-Length': contentLength}});

    } catch (error) {
      console.error(error);
      throw new Error(`Could not upload file due to error`)
    }

    const {persist, publicFile, removeMetaData} = options;
    const signedUrl = await this.finishUploadSession({key: uploadSession.key, persist, publicFile, removeMetaData});
    return {key: uploadSession.key, signedUrl};
  }

  /**
  * Initiate creation of zip archive for provided files keys
  * @param args 
  * @returns Returns a signed URL for temporary access to the zip object and key of the zip object
  */
  async createZipFile(args: CreateZipArgs): Promise<string> {
    const reqArgs: CreateZipRequestDto = { ...args, tenantId: this.tenantId };
    return (await this.getHttpClient().post<string>(`file/createZipFile`, reqArgs, { headers: this.getHeaders(), baseURL: this._getBaseUrl() })).data;
  }

  /**
   * Gets the base url by fetching current stage from Platform
   * @returns 
   */
  private _getBaseUrl(): string {
    return process.env.NEBULR_FILE_API_URL || this.BASE_URLS[this.getPlatformClient().stage];
  }
}
