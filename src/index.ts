import fs from 'fs';
import chalk from 'chalk';
import { SwaggerMd } from './SwaggerMd';

const run = (): void => {
  const [ , , jsonPath] = process.argv;

  if (!isExist(jsonPath)) {
    console.log(chalk.red("not found !!"));
    return;
  }
  console.log(chalk.green("Load " + jsonPath));
}

const isExist = (path: string): boolean => {
  try {
    fs.statSync(path);
    return true;
  } catch(err) {
    return false;
  }
}

run();