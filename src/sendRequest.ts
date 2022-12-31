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

      // if last attempt then go out of while loop and throw an error
      if (retries_count >= fullOptions.retries) {
        break;
      }

      retries_count++;

      await sleep(fullOptions.interval);
    }
  }

  throw last_error;
};