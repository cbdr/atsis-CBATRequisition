import { injectable, Container } from 'inversify';
import { isNullOrUndefined, isNull } from 'util';
//import DateUtils from '../../../core/utils/DateUtils';
import * as _ from 'lodash';
import Process from '../../npm/Process';
@injectable()
export default class buildQueryParams {
    public constructor(
        private process: Process
      ) {}
    public buildRequisitionQueryParameters(searchParams: any) {
        let pageNumber = searchParams.page;
        let query = ''
        if (pageNumber==1){
            query = `${this.process.getEnvVar('CBAT_AMAZON_REQ_SEARCH_API')}?params=Prop38:CH1;`;
        }
    else {
        query = `${this.process.getEnvVar('CBAT_AMAZON_REQ_SEARCH_API')}?params=prop38:CH1;page:${pageNumber}`;
    }
        
        return query;
    }
    public buildPostingQueryParameters(searchParams: any) {
        
        let positionId = searchParams;
        let query = `${this.process.getEnvVar('CBAT_AMAZON_POSTING_SEARCH_API')}?params=partnerid:${this.process.getEnvVar('CBAT_AMAZON_PARTNER_ID')};positionid:${positionId}`;
        return query;
    }
    s
    public buildPostingDeactivationQueryParameter(searchParams: any) {
        console.log('search params for deactivations are',searchParams)
        let positionId = searchParams;
        let query = `${this.process.getEnvVar('CBAT_AMAZON_POSTING_DEACTIVATON_API')}${positionId}`;
        return query;
    }
}