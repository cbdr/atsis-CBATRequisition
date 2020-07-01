import * as _ from 'lodash';
import { injectable } from 'inversify';
import { RequestLogger } from '../../core/http/RequestLogger';
import Logger from '../../core/logging/Logger';
import Process from '../../npm/Process';
import buildQueryParams from './buildQueryParams'
@injectable()
export default class queryGenerator {
    public constructor(
        private httpClient: RequestLogger,
        private logger: Logger,
        private buildQueryParam:buildQueryParams
    ){

    }

    public async getRequisitions(searchParameters:any): Promise<any> {
        const description: string = 'Gets the candidates from ICIMS';
        const bodyParameters: any= this.buildQueryParam.buildQueryParameters(searchParameters);
        const uri: string = ``;
        const response: any = await this.makeAPICall(description, bodyParameters) ;
        console.log(JSON.stringify(response));
        return response;
      }

      private async makeAPICall(description: string, uri: string): Promise<any> {
        try {
          const apiToken: any = this.getToken('generate token','https://cbinternalbeta.luceosolutions.com/rest/user/auth','cbinternalbeta','MftF5hGNK');
          let auth= Buffer.from(`cbinternalbeta` + ':' + `MftF5hGNK`, 'utf8').toString('base64')
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
            let auth= Buffer.from(`cbinternalbeta` + ':' + `MftF5hGNK`, 'utf8').toString('base64');
            console.log('auth is',auth);
        // const options: any = {
        //     description,
        //     method: 'Post',
        //     uri,
        //     headers: {
        //         ['content-Type']: 'application/json',
        //       Authorization: 'Basic '+auth
        //     },
        //     json: true,
        //     timeout: 10000,
        //     body:JSON.stringify({
        //         "id": 1,
        //         "password": ",kj[Y3b,D2D*Eyi77P"
        //     })
        //   };
        var options = {
            'method': 'POST',
            'url': 'https://cbinternalbeta.luceosolutions.com/rest/user/auth',
            'headers': {
              'Content-Type': 'application/json',
              'Authorization': 'Basic Y2JpbnRlcm5hbGJldGE6TWZ0RjVoR05L',
              'Cookie': 'PHPSESSID=875a876266e186c6dc1a787c4309c565'
            },
            body: JSON.stringify({"id":1,"password":",kj[Y3b,D2D*Eyi77P"})
          
          }
          console.log('options are',JSON.stringify(options));
          const response: any = await this.httpClient.call(options) ;
          console.log(JSON.stringify(response));
          return response;
        } catch (error) {
            console.log(JSON.stringify(error));
        }
        

      }

}