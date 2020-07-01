import * as _ from "lodash";
import { injectable } from "inversify";
import AsyncPoolFactory from "../../core/async/AsyncPoolFactory";
import { AsyncPool } from "../../core/async/AsyncPool";
import Logger from "../../core/logging/Logger";
import { isNullOrUndefined } from "util";
import requistionExtendedDataHandler from "../../requisition/search/extendedRequisitionRequest";
import apiFactory from '../../requisition/search/requistionApiFactory'
import errorHandler from '../../core/common/errors/ErrorParser'
import xmlUtils from '../../core/utils/XMLUtils'

@injectable()
export default class requisitionRequestProcessor {
    public constructor(
        private poolFactory: AsyncPoolFactory,
        private apiFactory: apiFactory,
        private extendedDataHandler: requistionExtendedDataHandler,
        private logger: Logger,
        private errorHandler : errorHandler,
        private xmlUtils: xmlUtils
    ) { }
    public async extractEntities(entity: any,config: any,cb: any,searchParameters: any): Promise<void> {
        await this.extractEntitiesWithFilter(entity, config, searchParameters, cb);
    }

    public async updateRequisitionJobs(){
        
    }
    private async extractEntitiesWithFilter(entity: any,config: any,searchParameters: any,cb: any): Promise<void> {
        let result: any = await this.extractPage(entity,'abc',config,searchParameters);
        //this.logger.info(AtsSyncEvents.CANDIDATE_EXTRACTION_INFO_RETRIEVED, { totalRegistersToProcess: results.searchResults.length, pageSize: searchParameters.limit });
        result = this.xmlUtils.xml2Json(result);
        console.log('xml to json is',JSON.stringify(result));
        await cb(result.searchResults);

        while (result.searchResults.length >= searchParameters.limit) {
            try {
                searchParameters.pageNumber++;
                const totalRequistions: number = result.searchResults.length;
                searchParameters.lastRetrievedEntityId = result.searchResults[totalRequistions - 1].id.toString();
                result = await this.extractPage(entity,'null',config,searchParameters);
                await cb(result.searchResults);
            } catch { }
        }
    }

    private async extractPage(entity:any, pageUrl: string, config: any,searchParameters: any, retryLimit?: number): Promise<any> {
        //this.logger.info(AtsSyncEvents.CANDIDATE_EXTRACTION_EXTRACTING_PAGE, { pageNumber: searchParameters.pageNumber });
        const api: any = this.apiFactory.createFromAtsSyncExtract(config);
    
        try {
         
            let candidates: any = null;
            candidates = await api.getRequisitions(searchParameters) as any;
            
            return candidates as any;
          
            
        } catch (error) {
          return await this.processError(error, entity, pageUrl, config, searchParameters, 5);
        }
      }
    private async processError(
        error: any, entity:any, pageUrl: string, config: any,
        searchParameters: any, retryLimit: number): Promise<any> {
        //this.logger.error(AtsSyncEvents.CANDIDATE_EXTRACTION_ERROR_FROM_PAGE, { pageNumber: searchParameters.pageNumber, error });
        let errorList:string[] = [];
        if (retryLimit > 0 && this.errorHandler.canErrorBeRetried(error, errorList)) {
          retryLimit--;
          //this.logger.info(AtsSyncEvents.CANDIDATE_EXTRACTION_RETRY_FROM_PAGE, { pageNumber: searchParameters.pageNumber });
    
          return await this.extractPage(entity, pageUrl, config, searchParameters, retryLimit);
        }
        //this.logger.info(AtsSyncEvents.CANDIDATE_EXTRACTION_RETRY_IS_OVER, { error, retryToMake: retryLimit });
        throw error;
      }
    
}
