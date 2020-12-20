import fs from 'fs';
import chalk from 'chalk';
import { SwaggerMd } from './SwaggerMd';

const run = (): void => {
  const [ , , jsonPath] = process.argv;

  if (!isExist(jsonPath)) {
    console.log(chalk.red("not found !!"));
    return;
  }

  const jsonBody: string = fs.readFileSync(jsonPath, "utf-8");
  console.log(chalk.green("Load " + jsonPath));

  const swaggerMd: SwaggerMd = new SwaggerMd(jsonBody);
  console.log(chalk.green("Load Success !!"));
  console.log(swaggerMd.output());
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