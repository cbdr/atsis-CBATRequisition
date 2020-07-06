import { ContainerModule , interfaces } from 'inversify';
import batchCreator from './batchCreator/batchCreator';
import requisitionBatchManager from './batch/requisitionBatchManager';


const InfrastructureModule: ContainerModule = new ContainerModule(
    (
        bind: interfaces.Bind
    ): any => {
      bind<requisitionBatchManager>(requisitionBatchManager).toSelf();
      bind<batchCreator>(batchCreator).toSelf();
      
    }
  );


export  default InfrastructureModule;