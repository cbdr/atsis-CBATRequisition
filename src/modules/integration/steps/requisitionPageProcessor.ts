import * as _ from "lodash";
import { injectable } from "inversify";
import AsyncPoolFactory from "../../core/async/AsyncPoolFactory";
import { AsyncPool } from "../../core/async/AsyncPool";
import Logger from "../../core/logging/Logger";
import { isNullOrUndefined } from "util";
import requistionPostingDataHandler from "./requisitionPostingProcessor";
import apiFactory from '../../requisition/search/requistionApiFactory'
import errorHandler from '../../core/common/errors/ErrorParser'
import xmlUtils from '../../core/utils/XMLUtils'

@injectable()
export default class requisitionRequestProcessor {
    public constructor(
        private poolFactory: AsyncPoolFactory,
        private apiFactory: apiFactory,
        private postingDataHandler: requistionPostingDataHandler,
        private logger: Logger,
        private errorHandler : errorHandler,
        private xmlUtils: xmlUtils
    ) { }
    public async extractEntities(entity: any,config: any,searchParameters: any,cb: any): Promise<void> {
        console.log('inside extract entities');
        await this.extractEntitiesWithFilter(entity, config, searchParameters, cb);
    }

    public async updateRequisitionJobs(){
        
    }
    private async extractEntitiesWithFilter(entity: any,config: any,searchParams: any,cb: any): Promise<void> {
        console.log('inside extract entities with filters');
        let searchParameters = {
          seachString:searchParams,
          page:1
        }
        searchParameters.page = 1;
        
        let result: any = await this.extractPage(entity,'abc',config,searchParameters,cb);
       
        //this.logger.info(AtsSyncEvents.CANDIDATE_EXTRACTION_INFO_RETRIEVED, { totalRegistersToProcess: results.searchResults.length, pageSize: searchParameters.limit });
        console.log("after extracting one page", JSON.stringify(result));
        //await cb(result);
        console.log('page number is ',parseInt(result.root.page._text), 'and total number page is ',parseInt(result.root.pageCount._text))

        while (parseInt(result.root.page._text) < parseInt(result.root.pageCount._text)) {
            try {
                searchParameters.page++;
                
                console.log('inside while loop',searchParameters.page++);
                result = await this.extractPage(entity,'null',config,searchParameters,cb);
                
                this.logger.info('xml to json is',result);
                //await cb(result);
            } catch { }
        }
        return ;
    }

    private async extractPage(entity:any, pageUrl: string, config: any,searchParameters: any,cb:any, retryLimit?: number): Promise<any> {
        //this.logger.info(AtsSyncEvents.CANDIDATE_EXTRACTION_EXTRACTING_PAGE, { pageNumber: searchParameters.pageNumber });
        console.log('inside extract page');
        const api: any = this.apiFactory.createFromAtsSyncExtract(config);
    
        try {
         
            let requistionsData: any = null;
            this.logger.info('getting requisitions in extract page',{});
            requistionsData = await api.getRequisitions(searchParameters) as any;
            console.log('1');
            requistionsData = this.xmlUtils.customizedXmlFormat(requistionsData);
            console.log('requistions data is',requistionsData);
            console.log('requistion result is 123456',JSON.stringify(requistionsData));
            
            if (parseInt(requistionsData.root.result.item.length)>0){
                console.log('5');
                await this.extractPostingDetails(requistionsData,api,cb,5);
                console.log('after getting posting details in extract page',JSON.stringify(requistionsData))
            }
            return requistionsData as any;
          
            
        } catch (error) {
            console.log("error is",error);
            this.logger.info('error is',error);
          //return await this.processError(error, entity, pageUrl, config, searchParameters, 5);
        }
      }

    private async extractPostingDetails(requisitions:any, api: any,cb:any, retryLimit: number): Promise<void> {
        try {
            requisitions.root = requisitions.root ;
          if (requisitions.root.result.item.length > 0) {
    
            const requisitionPool: AsyncPool = this.poolFactory.createPool(20);
            let i =0;
            console.log('length of requisitions ids array is',requisitions.root.result.item.length);
            for (const requisition of requisitions.root.result.item) {
                requisitionPool.startWorker({
                fn: async (): Promise<any> => {
                  requisition.postings = [];
                  console.log('value of i is',++i)
                  await this.postingDataHandler.extractRequistionPostingData(requisition as any, api,cb, retryLimit);
                }
              });
            }
            console.log("hiiii");
            await requisitionPool.waitForAll();

            console.log('byee');
            console.log("requistion data after all async is",JSON.stringify(requisitions))
            this.logger.info('all posting data along with requisition data',requisitions);
          }
        } catch (error) {
            console.log(error);
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
