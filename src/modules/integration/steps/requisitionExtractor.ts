import * as _ from 'lodash';
import { injectable } from 'inversify';
import Logger from '../../core/logging/Logger';
import AsyncPoolFactory from '../../core/async/AsyncPoolFactory';
import { AsyncPool } from '../../core/async/AsyncPool';
import pageProcessor from './requisitionPageProcessor'
import reqPostingDeactivator from './requisitionPostingDeactivator'
interface IExtractResult {
  success: number;
  error: number;
}

@injectable()
export default class requisitionExtractor {
  public constructor(private pageProcessor: pageProcessor,
                    private poolFactory: AsyncPoolFactory,
                    private logger: Logger,
                    private reqPostingDeactivator:reqPostingDeactivator
                    ) {
  }

  public async extract(searchParams: any, cb: any): Promise<void> {
    let success: number = 0;
    let error: number = 0;
    await this.pageProcessor.extractEntities('deActivate', {}, searchParams, async (reqPostingId: any,api:any): Promise<void> => {
      const result: IExtractResult = await this.DeactivateRequisitionsPostings(reqPostingId,api);
      success += result.success;
      error += result.error;
    });

    //this.logger.info(AtsSyncEvents.CANDIDATE_EXTRACTION_RESULT, { success, error });
  }

  private async DeactivateRequisitionsPostings(reqPostingId: any,api:any): Promise<any> {
    let success: number = 0;
    let error: number = 0;
    console.log('inside decativateRequistionPostings')
    await this.reqPostingDeactivator.deactivateReqPosting(reqPostingId,api);
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
