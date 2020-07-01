import { injectable, Container } from 'inversify';
import { isNullOrUndefined, isNull } from 'util';
//import DateUtils from '../../../core/utils/DateUtils';
import * as _ from 'lodash';
@injectable()
export default class buildQueryParams {
    public buildQueryParameters(searchParams: any) {
        let searchCriteria = searchParams.criteria;
        let query = 'https://cbinternalbeta.luceosolutions.com/rest/position/?params=prop38:test';
        return query;
    }

}