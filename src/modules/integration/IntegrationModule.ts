import { ContainerModule , interfaces } from 'inversify';
import requisitionOperation from './flow/requisitionOperation/requisitionOperation'
import requisitionExtrator from './steps/requisitionExtractor'
import requisitionPageProcessor from './steps/requisitionPageProcessor'
import requisitionPostingProcessor from './steps/requisitionPostingProcessor'
import requisitionRequestProcessor from './steps/requisitionPostingDeactivator'
const IntegrationModule: ContainerModule = new ContainerModule(
  (
      bind: interfaces.Bind
  ): any => {
     bind<requisitionOperation>(requisitionOperation).toSelf();
     bind<requisitionExtrator>(requisitionExtrator).toSelf();
     bind<requisitionPageProcessor>(requisitionPageProcessor).toSelf();
     bind<requisitionPostingProcessor>(requisitionPostingProcessor).toSelf();
     bind<requisitionRequestProcessor>(requisitionRequestProcessor).toSelf();
  }
);

export  default IntegrationModule;
