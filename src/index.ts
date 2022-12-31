import axios, { AxiosResponse } from 'axios';
import { sendRequest, Options, AsyncFunction } from './sendRequest';


async function execute() {
  // pass in here your async request 
  const request: AsyncFunction = async () => axios.get('https://jsonplaceholder.typicode.com/users');

  const options: Options = {
    retries: 50,
  };

  // always wrap "sendRequest" function in try-catch block
  try {
    const res = await sendRequest<AxiosResponse>(request, options);

    console.log('request success', res.data);
  } catch (error) {
    console.log('request error', error);
  }
}

execute();