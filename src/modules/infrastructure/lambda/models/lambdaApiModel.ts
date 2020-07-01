export interface ILambdaApiRequest {
    body: string;
    headers: any;
 }
 
 export interface ILambdaApiResponse {
   statusCode: number;
   headers: any;
   body: string;
 }
 