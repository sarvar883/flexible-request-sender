import { AxiosError } from 'axios';

export interface Options {
  // how many retries we want to perform
  retries?: number;
  // interval (in milliseconds) between retries
  interval?: number;
}

export type AsyncFunction = () => Promise<any>;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// if server sends an error response (status 5xx)
// then there is no need for retries
function isRetryableError(error: AxiosError): boolean {
  return (
    error.code !== 'ECONNABORTED' &&
    (!error.response || (error.response.status >= 500 && error.response.status <= 599))
  );
}

export async function sendRequest<T = any>(request: AsyncFunction, options: Options = {}): Promise<T> {
  // set default parameters
  const fullOptions: Required<Options> = {
    retries: options.retries || 1,
    interval: options.interval || 1000,
  };

  let retries_count: number = 1;
  let last_error;

  while (retries_count <= fullOptions.retries) {
    try {
      const response: T = await request();

      return response;

    } catch (err) {
      last_error = err;

      if (
        // if last attempt or isRetryableError
        retries_count >= fullOptions.retries
        || !isRetryableError(err as AxiosError)
      ) {
        // then go out of while loop and throw an error
        break;
      }

      retries_count++;

      await sleep(fullOptions.interval);
    }
  }

  throw last_error;
};