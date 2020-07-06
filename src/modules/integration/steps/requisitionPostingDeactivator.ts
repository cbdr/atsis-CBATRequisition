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
    
    public async deactivateReqPosting(searchParams:any,api:any){
        await api.deactivateReqPostingById(searchParams);
    }
    
}
