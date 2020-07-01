import { injectable } from 'inversify';

@injectable()
export default class Process {
  public getPid(): number {
    return process.pid;
  }

  public getEnvVar(name: string): any {
    return process.env[name];
  }

  public shouldRun(): boolean {
    return true;
  }

  public exit(exitCode: number): void {
    setInterval(() => {
      if (Number(this.getEnvVar('ScalyrCalls') || '0') <= 0) {
        process.exit(exitCode);
      }
    }, 1000);
  }

  public getArg(index: number): any {
     return  index < process.argv.length ? process.argv[index] : null;
  }

  public getCwd(): string {
    return process.cwd();
  }

  public setEnvVar(name: string, value: string): string {
    return process.env[name] = value;
  }
}
