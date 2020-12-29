import { NowRequest, NowResponse } from '@vercel/node';
import SwaggerMd from 'swagger-md';

export default (request: NowRequest, response: NowResponse) => {
  if(request.method === 'POST') {
    const converter: SwaggerMd = new SwaggerMd(request.body);
    response.status(200).send(converter.output());
  } else {
    response.status(405);
  }
}