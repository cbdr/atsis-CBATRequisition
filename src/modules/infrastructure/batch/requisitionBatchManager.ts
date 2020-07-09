import { injectable } from 'inversify';
import { isNullOrUndefined } from 'util';
import Logger from '../../core/logging/Logger';
import AWSBatch, { ISubmitJobRequest, IListJobsRequest, IListJobsResponse, IJobSummary } from '../../npm/AWSBatch';
import ConfigurationLoader from '../../core/configuration/ConfigurationLoader';

export interface IBatchConfiguration {
   region: string;
   configurations: [];
   vendorName: string;
   jobDefinition: string;
   jobQueue: string;
   memory?: number;
   batchName?: string;
   configurationIdToRun?: string;
}

@injectable()
export default class ATSSyncBatchManager {
  public constructor(private batch: AWSBatch, private logger: Logger, private configurationLoader: ConfigurationLoader) { }

  public async submitConfigurations(batchConfigurations: any): Promise<void> {

        const jobInfo: ISubmitJobRequest = this.createJobInfo( batchConfigurations);
        this.logger.info('batch job info is ',{jobInfo})
        await this.batch.submitJob(batchConfigurations.region, jobInfo);
        
  }

  private createJobInfo(batchConfigurations: any): ISubmitJobRequest {
    
    const memory: number =  1024;
    const jobInfo: ISubmitJobRequest = {
      jobName: `batchjob`,
      jobDefinition: batchConfigurations.jobDefinition,
      jobQueue: batchConfigurations.jobQueue,
      parameters: {
        searchParams: batchConfigurations.searchParams,
        batchName: batchConfigurations.batchName
      },
      containerOverrides: {
        environment: this.configurationLoader.getConfigurationEnvVars(),
        memory
      }
    };

    return jobInfo;
  }

}
