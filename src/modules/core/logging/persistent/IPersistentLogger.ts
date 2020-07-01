export interface IPersistentLogger {
  write(context: any): Promise<void>;
}
