import { NowRequest, NowResponse } from '@vercel/node';

export default (request: NowRequest, response: NowResponse) => {
  if(request.method === 'POST') {

    response.status(200).send(request.body);
  } else {
    response.status(405);
  }
}