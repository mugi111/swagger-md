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

  output = (): string => {
    this.printTitle();
    return this._generated;
  }
}
