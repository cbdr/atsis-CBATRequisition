import * as AWS from 'aws-sdk';
import { injectable } from 'inversify';
import * as memoryStreams from 'memory-streams';
import * as stream from 'stream';
import ProcessError from '../core/common/errors/ProcessError';

export type S3ListObjectsOutput = AWS.S3.ListObjectsV2Output;
export type S3Object = AWS.S3.Object;
export interface IS3CopyObject {
   oldBucketName: string;
   oldKey: string;
   newBucketName: string;
   newKey: string;
}

@injectable()
export default class S3 {
  public async createBucket(region: string, options: AWS.S3.CreateBucketRequest): Promise<AWS.S3.CreateBucketOutput> {
     const s3: AWS.S3 = new AWS.S3({region});
     return s3.createBucket(options).promise();
  }

  public async deleteBucket(region: string, options: AWS.S3.DeleteBucketRequest): Promise<any> {
    const s3: AWS.S3 = new AWS.S3({region});
    return s3.deleteBucket(options).promise();
  }

  public async upload(region: string, options: AWS.S3.PutObjectRequest): Promise<AWS.S3.ManagedUpload.SendData> {
    const s3: AWS.S3 = new AWS.S3({region});
    return s3.upload(options).promise();
  }

  public async uploadStream(region: string, options: AWS.S3.PutObjectRequest, readableStream: memoryStreams.ReadableStream): Promise<void> {
    const s3: AWS.S3 = new AWS.S3({ region });
    const upload: any = (s3Bucket: AWS.S3, bucket: string, key: string): any => {
      const passStream: any = new stream.PassThrough();
      return {
        writeStream: passStream,
        promise: s3Bucket.upload({ Bucket: bucket, Key: key, Body: passStream }).promise()
      };
    };
    const { writeStream, promise }: any = upload(s3, options.Bucket, options.Key);
    readableStream.pipe(writeStream);
    let error: any = null;
    let failure: boolean = false;
    await promise.catch((reason: any) => {
      failure = true;
      error = reason;
    });

    if (failure) {
      throw new ProcessError(error);
    }
  }

  public async getObject(region: string, options: AWS.S3.GetObjectRequest): Promise<AWS.S3.GetObjectOutput> {
    const s3: AWS.S3 = new AWS.S3({region});
    return s3.getObject(options).promise();
  }
  public  getObjectStream(region: string, options: AWS.S3.GetObjectRequest): stream.Readable {
    const s3: AWS.S3 = new AWS.S3({region});
    return s3.getObject(options).createReadStream();
  }

  public async getBucketItemList(region: string, options: AWS.S3.ListObjectsV2Request): Promise<S3ListObjectsOutput> {
    const s3: AWS.S3 = new AWS.S3({region});
    return s3.listObjectsV2(options).promise();
  }

  public async moveObject(region: string, options: IS3CopyObject): Promise<void> {
    const s3: AWS.S3 = new AWS.S3({region});
    await  s3.copyObject({
      Bucket: options.newBucketName,
      CopySource: `/${options.oldBucketName}/${options.oldKey}`,
      Key: options.newKey
    }).promise();
    await s3.deleteObject(
      {
        Bucket: options.oldBucketName,
        Key: options.oldKey
      }
    ).promise();
  }
}
