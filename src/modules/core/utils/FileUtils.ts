import { injectable } from 'inversify';
import * as path from 'path';

@injectable()
export default class FileUtils {
  public getFileExtension(fileName: string): string {
    return path.posix.extname(fileName);
  }

  public getDirectoryName(fileFullPath: string): string {
    return path.posix.dirname(fileFullPath);
  }

  public getFileNameFromFullPath(fileFullPath: string, ext?: string): string {
    return path.posix.basename(fileFullPath, ext);
  }
}
