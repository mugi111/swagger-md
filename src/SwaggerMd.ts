import { Request, SwaggerJson } from "./types";

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

  private printEndpoint = (obj: any): void => {
    for (const method in obj) {
      const request = obj[method] as Request;
      this._generated += `#### ${method}\n`;
      this._generated += `${request.description}  \n`;
      this._generated += `##### Parameters  \n`;
      this._generated += `| Name | Type | Description |\n`;
      this._generated += `|------|------|-------------|\n`;
      for (const param of request.parameters) {
        this._generated += `| ${param.name} | ${param.type} | ${param.description} |\n`;
      }
      this._generated += `\n`;
    }
  }

  private printEndpoints = (): void => {
    this._generated += `## Endpoint  \n`;
    for (const path in this._object.paths) {
      this._generated += `### ${path}  \n`;
      this.printEndpoint(this._object.paths[path]);
    }
  }

  output = (): string => {
    this.printTitle();
    this.printVersion();
    this.printEndpoints();
    return this._generated;
  }
}
