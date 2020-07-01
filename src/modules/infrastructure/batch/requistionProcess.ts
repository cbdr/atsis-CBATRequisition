import 'reflect-metadata';
import * as dotEnv from 'dotenv';
import { Container } from 'inversify';
import NpmModule from '../../npm/NpmModule';
import CoreModule from '../../core/coreModule';
import RequitionModule from '../../requisition/requisitionModule';
import InfrastructureModule from '../InfrastructureModule';
import IntegrationModule from '../../integration/IntegrationModule';
import Logger from '../../core/logging/Logger';
import Process from '../../npm/Process';
import requisitionOperation from '../../integration/flow/requisitionOperation/requisitionOperation';

dotEnv.config();

async function  main(): Promise<void> {
    const container: Container = new Container();
    container.load( NpmModule , CoreModule, RequitionModule, InfrastructureModule,IntegrationModule);
    container.bind<any>('initialContext').toConstantValue({});
    container.bind<string>('fileName').toConstantValue(__filename);
    container.bind<Container>(Container).toConstantValue(container);
    //container.rebind<MySupplyApi>(MySupplyApi).to(MySupplyApiRetry);
  
    // TODO this is very similar to candidate pull only
    const requistion: any = container.get<requisitionOperation>(requisitionOperation);
  
    const log: Logger = container.get<Logger>(Logger);
    const process: Process = container.get<Process>(Process);
    const searchParams: any = {
        params:'prop38:test'
    };
    if (searchParams) {
      try {
        await requistion.process(searchParams);
      } catch (err) {
        log.error('An error ocurred!', err);
      }
    } else {
       log.error('Configuration parameter is needed', {searchParams});
       process.exit(-1);
    }
  
  }
  
  main();