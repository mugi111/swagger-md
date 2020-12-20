import { SwaggerJson } from "./types";

export class SwaggerMd {
  private _object: SwaggerJson;

  constructor(body: string) {
    this._object = JSON.parse(body);
    console.log(this._object.swagger);
  }
}
