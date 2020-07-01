import { injectable, Container } from 'inversify';
import ICIMSApi from './queryGenerator';
import queryGenerator from './queryGenerator';

@injectable()
export default class requisitionApiFactory {
  public constructor(private container: Container) { }

  public createFromAtsSyncExtract(extractConfig: any): any {
    const api: any = this.container.get<queryGenerator>(queryGenerator);
    return api;
  }
}
