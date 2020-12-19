import fs from 'fs';
import chalk from 'chalk';
import { SwaggerMd } from './SwaggerMd';

const run = (): void => {
  const [ , , jsonPath] = process.argv;

  if (fs.statSync(jsonPath)){
    console.log(chalk.red("not found !!"));
    return;
  }
}

run();