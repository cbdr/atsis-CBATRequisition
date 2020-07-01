import * as _ from 'lodash';
import { injectable } from 'inversify';
import Logger from '../../core/logging/Logger';
import AsyncPoolFactory from '../../core/async/AsyncPoolFactory';
import { AsyncPool } from '../../core/async/AsyncPool';
import pageProcessor from './requisitionPageProcessor'
interface IExtractResult {
  success: number;
  error: number;
}

@injectable()
export default class requisitionExtractor {
  public constructor(private pageProcessor: pageProcessor,
                    private poolFactory: AsyncPoolFactory,
                    private logger: Logger) {
  }

  public async extract(config: any, cb: any): Promise<void> {
    let success: number = 0;
    let error: number = 0;
    await this.pageProcessor.extractEntities('Candidate', config, 'searchParam', async (candidateList: any): Promise<void> => {
      const result: IExtractResult = await this.processCandidateResults(candidateList, cb);
      success += result.success;
      error += result.error;
    });

    //this.logger.info(AtsSyncEvents.CANDIDATE_EXTRACTION_RESULT, { success, error });
  }

  private async processCandidateResults(apiCandidates: any, cb: any): Promise<any> {
    let success: number = 0;
    let error: number = 0;
    //this.logger.info(AtsSyncEvents.CANDIDATE_EXTRACTION_PROCESSING_RESULTS_STARTED, { candidatesToProcess: apiCandidates.length });
    if (apiCandidates.length > 0) {
      const candidatePool: AsyncPool = this.poolFactory.createPool(20);
      for (const apiCandidate of apiCandidates) {
        candidatePool.startWorker({
          fn: async (): Promise<any> => {
            if (await this.processCandidate(apiCandidate, cb)) {
              success++;
            } else {
              error++;
            }
          }
        });
      }
      await candidatePool.waitForAll();
    }

    //this.logger.info(AtsSyncEvents.CANDIDATE_EXTRACTION_PROCESSING_RESULTS_FINISHED, { success, error });
    return { success, error };
  }

  private async processCandidate(apiCandidate: any, cb: any): Promise<boolean> {
    try {
      const cbCandidate: any = "this.mapper.mapFromCandidate(apiCandidate);"
      await cb(cbCandidate);
      return true;
    } catch (error) {
      //this.logger.error(AtsSyncEvents.CANDIDATE_EXTRACTION_PROCESSING_RESULTS_ERROR, { candidateId: _.get(apiCandidate, 'id'), candidateEmail: _.get(apiCandidate, 'email'), error });
      return false;
    }
  }
}
