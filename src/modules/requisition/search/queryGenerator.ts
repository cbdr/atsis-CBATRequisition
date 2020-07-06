import * as _ from 'lodash';
import { injectable } from 'inversify';
import { RequestLogger } from '../../core/http/RequestLogger';
import Logger from '../../core/logging/Logger';
import Process from '../../npm/Process';
import buildQueryParams from './buildQueryParams'
import { isNullOrUndefined, isNull } from 'util';
@injectable()
export default class queryGenerator {
    private token :string = null;
    public constructor(
        private httpClient: RequestLogger,
        private logger: Logger,
        private buildQueryParam:buildQueryParams,
        private process: Process
    ){

    }

    public async getRequisitions(searchParameters:any): Promise<any> {
        console.log('search params in get requisitions are',searchParameters);
        const description: string = 'Gets the candidates from ICIMS';
        const bodyParameters: any= this.buildQueryParam.buildRequisitionQueryParameters(searchParameters);
        const uri: string = ``;
        const response: any = await this.makeAPICall(description, bodyParameters) ;
        console.log('response for requistions request query is',JSON.stringify(response));
        return response;
      }
      public async getPostingsId(searchParameters:any): Promise<any> {
          console.log('search params in get posting id',searchParameters)
        const description: string = 'Gets the candidates from ICIMS';
        const bodyParameters: any= this.buildQueryParam.buildPostingQueryParameters(searchParameters);
        const uri: string = ``;
        const response: any = await this.makeAPICall(description, bodyParameters) ;
        console.log('posting respose 1',JSON.stringify(response));
        return response;
      }
      public async deactivateReqPostingById(searchParams:any): Promise<any>{
        const description: string = 'Gets the candidates from ICIMS';
        const bodyParameters: any= this.buildQueryParam.buildPostingDeactivationQueryParameter(searchParams);
        const uri: string = ``;
        const response: any = await this.makeAPICall1(description, bodyParameters) ;
        console.log('posting respose 1',response);
        return response;
      }
      private async makeAPICall(description: string, uri: string): Promise<any> {
        try {
          console.log('token inside make api call is',this.token);
         const apiToken: any = !isNullOrUndefined(this.token)? this.token :await this.getToken('generate token','','','');
          let auth= Buffer.from(`${this.process.getEnvVar('CBAT_AMAZON_USERNAME')}` + ':' + `${this.process.getEnvVar('CBAT_AMAZON_PASSWORD')}`, 'utf8').toString('base64')
          const options: any = {
            description,
            method: 'GET',
            uri,
            headers: {
                ["Ats-Auth-Token"]: apiToken.auth_code,
                Authorization: 'Basic '+auth
            },
            json: true,
            timeout: 10000
          };
          //console.log('options for makeApiCall',options)
          const response: any = await this.httpClient.call(options) as any;
          
          return response;
        } catch (error) {
            console.log(JSON.stringify(error));
            throw "error in getting search Query"
          
        }
      }
      private async makeAPICall1(description: string, uri: string): Promise<any> {
        try {
          console.log('token inside make api call is',this.token);
         const apiToken: any = !isNullOrUndefined(this.token)? this.token :await this.getToken('generate token','','','');
         console.log("api token is",apiToken)
          let auth= Buffer.from(`${this.process.getEnvVar('CBAT_AMAZON_USERNAME')}` + ':' + `${this.process.getEnvVar('CBAT_AMAZON_PASSWORD')}`, 'utf8').toString('base64')
          const options: any = {
            description,
            method: 'PUT',
            uri,
            body:JSON.stringify({
              "status":"inactive"
          }),
            headers: {
                ["Ats-Auth-Token"]: apiToken.auth_code,
                Authorization: 'Basic '+auth
            },
            json: true,
            timeout: 10000
          };
          console.log('options for makeApiCall for deactivation is',options)
          const response: any = await this.httpClient.call(options) as any;
          
          return response;
        } catch (error) {
            console.log(JSON.stringify(error));
            throw "error in getting search Query"
          
        }
      }

    //   private canRetry(error: any, candidateId: string, entity: any, retryLimit: number): boolean {
    //     //this.logger.error(AtsSyncEvents.CANDIDATE_EXTRACTION_ERROR_EXTENDED, { candidateId, entity });
    //     if (retryLimit > 0 && this.errorHandler.canErrorBeRetried(error, ICIMSError.errorList, ErrorPolicy.AllowErrorInList)) {
    //       //this.logger.info(AtsSyncEvents.CANDIDATE_EXTRACTION_RETRYING_EXTENDED, { candidateId, entity });
    //       return true;
    //     }
    
    //     //this.logger.info(AtsSyncEvents.CANDIDATE_EXTRACTION_EXTENDED_RETRY_IS_OVER, { error, candidateId, entity, retryToMake: retryLimit });
    //     return false;
    //   }
      private async getToken(description:any,uri:any,username:any, password:any){
        try {
            console.log('inside get token');
            let auth= Buffer.from(`${this.process.getEnvVar('CBAT_AMAZON_USERNAME')}` + ':' + `${this.process.getEnvVar('CBAT_AMAZON_PASSWORD')}`, 'utf8').toString('base64');
            console.log('auth is',auth);
        var options = {
            'method': 'POST',
            'url': `${this.process.getEnvVar('CBAT_AMAZON_AUTH_TOKEN_API')}`,
            'headers': {
              'Content-Type': 'application/json',
              'Authorization': 'basic '+auth,
            },
            body: JSON.stringify({"id":1,"password":",kj[Y3b,D2D*Eyi77P"})
          
          }
          console.log('options in get token is',JSON.stringify(options));
          const response: any = await this.httpClient.call(options) ;
          //console.log(JSON.stringify(response));
          this.token = response;
          return response;
        } catch (error) {
            console.log('error inside auth token api is',JSON.stringify(error));
        }
        

      }

}