import { SwaggerJson } from "./types";

export class SwaggerMd {
  private _object: SwaggerJson;
  private _generated: string;

  constructor(body: string) {
    this._object = JSON.parse(body);
  }

  private printTitle() {
    this._generated += `# ${this._object.info.title}  \n`;
  }
}
