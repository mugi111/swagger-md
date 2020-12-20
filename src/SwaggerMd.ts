import { SwaggerJson } from "./types";

export class SwaggerMd {
  private _object: SwaggerJson;
  private _generated: string;

  constructor(body: string) {
    this._object = JSON.parse(body);
    this._generated = "";
  }

  private printTitle = (): void => {
    this._generated += `# ${this._object.info.title}  \n`;
  }

  private printVersion = (): void => {
    this._generated += `version:${this._object.swagger}  \n`;
  }

  output = (): string => {
    this.printTitle();
    this.printVersion();
    return this._generated;
  }
}
