import { ContainerModule , interfaces } from 'inversify';
import SQS from './SQS';
import Cluster from './Cluster';
import Process from './Process';
import Lambda from './Lambda';
import { Request } from './Request';
import S3 from './S3';
import AWSBatch from './AWSBatch';
import DynamoClient from './DynamoClient';
import JWT from './JWT';
import SNS from './SNS';
import UUID from './UUID'

const NpmModule: ContainerModule = new ContainerModule(
  (
      bind: interfaces.Bind
  ): any => {
    bind<SQS>(SQS).toSelf();
    bind<S3>(S3).toSelf();
    bind<Cluster>(Cluster).toSelf();
    bind<Process>(Process).toSelf();
    bind<Lambda>(Lambda).toSelf();
    bind<Request>(Request).toSelf();
    bind<AWSBatch>(AWSBatch).toSelf();
    bind<DynamoClient>(DynamoClient).toSelf();
    bind<JWT>(JWT).toSelf();
    bind<SNS>(SNS).toSelf();
    bind<UUID>(UUID).toSelf();
  }
);

export  default NpmModule;
