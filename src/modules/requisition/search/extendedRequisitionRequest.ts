import { injectable } from "inversify";
import xmlUtils from './../../core/utils/XMLUtils'
import Logger from './../../core/logging/Logger'
import AsyncPoolFactory from "../../core/async/AsyncPoolFactory";
import { AsyncPool } from "../../core/async/AsyncPool";


@injectable()
export default class extendedRequisitionRequest {

    public constructor(
        private xmlUtils: xmlUtils,
        private logger: Logger,
        private poolFactory: AsyncPoolFactory
        
    ){

    }
    public async populateCandidateExtendedData(requisitionData: any, api: any,page:any,cb:any, retryLimit: number): Promise<void> {
        //console.log('inside populate candidate and requisition data i',requisitionData)
        let postingData = await this.getPostingDetail(requisitionData, api,page, retryLimit) as any;
        console.log('posting data is ', postingData)
        postingData = this.xmlUtils.customizedXmlFormat(postingData);
        console.log('posting data is', JSON.stringify(postingData), 'length of item in posting is', postingData.root.result.item.length);
        requisitionData.postings.push(postingData);
        this.logger.info('populate candidate extended data and requistion data is',requisitionData)
        if(typeof(postingData.root.result.item)){
    
                const requisitionPool: AsyncPool = this.poolFactory.createPool(20);
                let i =0;
                console.log('length of requisitions ids array is',postingData.root.result.item.length);
                for (const posting of postingData.root.result.item) {
                    requisitionPool.startWorker({
                    fn: async (): Promise<any> => {
                      console.log('value of i is',++i)
                      let deactivationStatus = await cb(posting.id._text, api, retryLimit);
                      posting.deactivationStatus = deactivationStatus;
                    }
                  });
                }
                await requisitionPool.waitForAll();
              
        }
        
        //console.log('inside populate candidate extended data',requisitionData);
     }

     private async getPostingDetail(requisitionData: any, api: any,page:any, retryLimit: number): Promise<any> {
        const description: string = 'Gets the postingDetails for the requisition';
        //console.log('requistion data inisde get posting details is',requisitionData);
        let postingData = await api.getPostingsId(requisitionData.id._text.toString(), retryLimit) ;

        return postingData;
      }
}
