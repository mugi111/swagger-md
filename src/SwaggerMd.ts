import { Request, Tag, SwaggerJson, ClassifiedRequests, RequestWithData } from "./types";

export class SwaggerMd {
  private _object: SwaggerJson;
  private _generated: string;

  constructor(body: string) {
    this._object = JSON.parse(body);
    this._generated = "";
  }

  private _getTags = (): Tag[] => {
    return this._object.tags;
  }

  private _filterWithTags = (): ClassifiedRequests[] => {
    let filtered: ClassifiedRequests[] = [];
    for (const tag of this._getTags()) {
      let reqs: RequestWithData[] = []
      for (const path in this._object.paths) {
        for (const method in this._object.paths[path]) {
          reqs.push(
            {
              endpoint: path,
              method: method,
              request: this._object.paths[path][method]
            }
          );
        }
      }
      filtered.push(
        {
          tag,
          requests: reqs
        }
      );
    }
    return filtered;
  }

  private _printTitle = (): void => {
    this._generated += `# ${this._object.info.title}  \n`;
  }

  private _printVersion = (): void => {
    this._generated += `version:${this._object.swagger}  \n`;
  }

  private _printRequest = (reqs: RequestWithData[]): void => {
    for (const req of reqs) {
      this._generated += `#### ${req.method} ${req.endpoint}\n`;
      this._generated += `${req.request.description}  \n`;
      this._generated += `##### Parameters  \n`;
      this._generated += `| Name | Type | Description |\n`;
      this._generated += `|------|------|-------------|\n`;
      for (const param of req.request.parameters) {
        this._generated += `| ${param.name} | ${param.type} | ${param.description} |\n`;
      }
      this._generated += `\n`;
    }
  }

  private _printRequests = (): void => {
    const filtered: ClassifiedRequests[] = this._filterWithTags();
    this._generated += `## Endpoint  \n`;
    for (const reqs of filtered) {
      this._generated += `### ${reqs.tag.name}  \n`;
      this._printRequest(reqs.requests);
    }
  }

  output = (): string => {
    this._printTitle();
    this._printVersion();
    this._printRequests();
    return this._generated;
  }
}
