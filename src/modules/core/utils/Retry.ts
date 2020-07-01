import MaxRetryError from '../common/errors/MaxRetryError';

export async function retry(fn: () => Promise<any>, retryCount: number = 3): Promise<any> {
  let currentRetry: number = 0;
  let lastErr: Error = null;
  while (currentRetry < retryCount) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      currentRetry++;
    }
  }
  throw new MaxRetryError(lastErr);
}
