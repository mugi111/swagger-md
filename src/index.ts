import fs from 'fs';
import { SwaggerMd } from './SwaggerMd';

const run = (): void => {
  const [ , , jsonPath] = process.argv;

  if (fs.statSync(jsonPath)){
    return;
  }
}

run();