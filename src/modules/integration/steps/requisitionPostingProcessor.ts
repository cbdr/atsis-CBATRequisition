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
import { resolveAny } from "dns";

@injectable()
export default class requisitionPostingProcessor {
    public constructor(
        private poolFactory: AsyncPoolFactory,
        private apiFactory: apiFactory,
        private extendedDataHandler: requistionExtendedDataHandler,
        private logger: Logger,
        private errorHandler : errorHandler,
        private xmlUtils: xmlUtils
    ) { }
    public async extractRequistionPostingData(requisitionData: any, api: any,cb:any, retryLimit: number): Promise<void> {
        console.log('inside extractRequisitionPostings data and requisition data i',requisitionData)
        await this.extractPostings(requisitionData, api,cb, retryLimit) as any;
        console.log('inside populate candidate extended data',requisitionData);
     }
     private async extractPostings(requistionData: any,api: any,cb:any,retryLimit: any): Promise<void> {
        console.log('inside extract entities with filters');
        let page = 1;
        await this.extractPostingPage(requistionData,api,page,cb,2);
        console.log("after extracting one posting page",JSON.stringify(requistionData))
        //await cb(result);
        
        while (parseInt(requistionData.postings[page-1].page._text) < parseInt(requistionData.postings[page-1].pageCount._text)) {
            try {
                page++;
                console.log('inside while loop of extract postings',page++);
                requistionData = await this.extractPostingPage(requistionData,api,page,2);
                this.logger.info('xml to json is',requistionData);
                //await cb(result);
            } catch { }
        }
    }
    private async extractPostingPage(requistionData:any, api: any,page:any,cb:any,retryLimit?: number): Promise<any> {
        //this.logger.info(AtsSyncEvents.CANDIDATE_EXTRACTION_EXTRACTING_PAGE, { pageNumber: searchParameters.pageNumber });
        console.log('inside extract page of extarct posting page');
    
        try {
         
            let result: any = null;
            await this.extractPostingDetails(requistionData,api,page,cb,2) as any;
            console.log('requistion data in extarct posting page is',JSON.stringify(requistionData));

            if (requistionData.result>0){
                await this.extractPostingDetails(requistionData,api,page,cb,2);
                this.logger.info('after getting posting details in extract page if loop', result);
            }
            return result as any;     
            
        } catch (error) {
            console.log("error is",error);
            this.logger.info('error is',error);
          //return await this.processError(error, entity, pageUrl, config, searchParameters, 5);
        }
      }

    public async updateRequisitionJobs(){
        
    }

    private async extractPostingDetails(requisitions:any, api: any, page,cb:any, retryLimit: number): Promise<void> {
        try {
            console.log('inside extract posting Details')
            await this.extendedDataHandler.populateCandidateExtendedData(requisitions as any, api,page,cb,retryLimit);
        } catch (error) {
            
        }
        // try {
        //     requisitions.root = requisitions.root ;
        //   if (requisitions.root.result.item.length > 0) {
    
        //     const requisitionPool: AsyncPool = this.poolFactory.createPool(20);
        //     for (const requisition of requisitions.root.result.item) {
        //         requisitionPool.startWorker({
        //         fn: async (): Promise<any> => {
        //           await this.extendedDataHandler.populateCandidateExtendedData(requisition as any, api, retryLimit);
        //         }
        //       });
        //     }
        //     console.log("hiiii");
        //     await requisitionPool.waitForAll();

        //     console.log('byee');
        //     console.log("requistion data after all async is",JSON.stringify(requisitions))
        //     this.logger.info('all posting data along with requisition data',requisitions);
        //   }
        // } catch (error) {
        //     console.log(error);
        //   }
        }

    private async processError(
        error: any, entity:any, pageUrl: string, config: any,
        searchParameters: any, retryLimit: number): Promise<any> {
        //this.logger.error(AtsSyncEvents.CANDIDATE_EXTRACTION_ERROR_FROM_PAGE, { pageNumber: searchParameters.pageNumber, error });
        let errorList:string[] = [];
        if (retryLimit > 0 && this.errorHandler.canErrorBeRetried(error, errorList)) {
          retryLimit--;
          //this.logger.info(AtsSyncEvents.CANDIDATE_EXTRACTION_RETRY_FROM_PAGE, { pageNumber: searchParameters.pageNumber });
    
          return await this.extractPostingPage(entity, pageUrl, config, searchParameters);
        }
        //this.logger.info(AtsSyncEvents.CANDIDATE_EXTRACTION_RETRY_IS_OVER, { error, retryToMake: retryLimit });
        throw error;
      }
    
}
