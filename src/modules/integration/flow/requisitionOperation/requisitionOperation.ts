import Logger from '../../../core/logging/Logger';
import { injectable, Container } from 'inversify';
import DateUtils from '../../../core/utils/DateUtils';
import ConfigurationError from '../../../core/common/errors/ConfigurationError';
import { isNullOrUndefined, isNull } from 'util';
import requisitionRequestProcessor from '../../../requisition/extract/flow/requisitionRequestProcessor'
import requisitionExtractor from '../../steps/requisitionExtractor';

@injectable()
export default class requisitionOperation {
  public constructor(
    private logger: Logger,
    private dateUtils: DateUtils,
    private container: Container
    ) {
    this.logger = this.logger.enterNewFile(__filename);
  }

  public async process(searchParams: string): Promise<void> {
    
   
    // write a code to parse string for getting parameters 

   
    

    //this.logger.trace(AtsSyncEvents.SYNC_SEARCH_FILTERS, {filters: extractConfiguration.filters});
    //this.logger.trace(AtsSyncEvents.SYNC_ATS_CONFIG, atsSyncConfig);
    const extractor = this.container.get<requisitionExtractor>(requisitionExtractor);
    await extractor.extract(searchParams, async (candidate: any): Promise<void> => {
      
     //this.logger.info(AtsSyncEvents.SYNC_CANDIDATE_SENT, { emailAddress: candidate.email });
    });
    

    //this.logger.info(AtsSyncEvents.SYNC_BATCH_DONE);
  }
}
