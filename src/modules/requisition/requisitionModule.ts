import { ContainerModule , interfaces, Container } from 'inversify';
import queryGenerator from './search/queryGenerator'
import buildQueryParams from './search/buildQueryParams'
import requisitionRequestProcsessor from './extract/flow/requisitionRequestProcessor'
import requistionApiFactory from './search/requistionApiFactory'
import extendedRequistionRequest from './search/extendedRequisitionRequest';

const RequisitionModule: ContainerModule = new ContainerModule(
(bind:interfaces.Bind):any =>{
bind<queryGenerator>(queryGenerator).toSelf();
bind<buildQueryParams>(buildQueryParams).toSelf();
bind<requisitionRequestProcsessor>(requisitionRequestProcsessor).toSelf();
bind<requistionApiFactory>(requistionApiFactory).toSelf();
bind<extendedRequistionRequest>(extendedRequistionRequest).toSelf();
}
)
export  default RequisitionModule;