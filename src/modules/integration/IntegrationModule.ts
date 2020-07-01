import { ContainerModule , interfaces } from 'inversify';
import requisitionOperation from './flow/requisitionOperation/requisitionOperation'
import requisitionExtrator from './steps/requisitionExtractor'
import requisitionPageProcessor from './steps/requisitionPageProcessor'
const IntegrationModule: ContainerModule = new ContainerModule(
  (
      bind: interfaces.Bind
  ): any => {
     bind<requisitionOperation>(requisitionOperation).toSelf();
     bind<requisitionExtrator>(requisitionExtrator).toSelf();
     bind<requisitionPageProcessor>(requisitionPageProcessor).toSelf();
  }
);

export  default IntegrationModule;
