import * as AWS from 'aws-sdk';
import { injectable } from 'inversify';

export type ISubmitJobRequest = AWS.Batch.SubmitJobRequest;
export type ISubmitJobResponse = AWS.Batch.SubmitJobResponse;
export type IListJobsRequest = AWS.Batch.ListJobsRequest;
export type IListJobsResponse = AWS.Batch.ListJobsResponse;
export type IJobStatus = AWS.Batch.JobStatus;
export type IJobSummary = AWS.Batch.JobSummary;

@injectable()
export default class AWSBatch {
  public async submitJob(region: string, options: ISubmitJobRequest): Promise<ISubmitJobResponse> {
    const batch: AWS.Batch = new AWS.Batch({region});
    return batch.submitJob(options).promise();
  }

  public async listJobs(region: string, options: IListJobsRequest): Promise<IListJobsResponse> {
    const batch: AWS.Batch = new AWS.Batch({region});
    return batch.listJobs(options).promise();
  }
}
