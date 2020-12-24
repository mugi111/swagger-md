import { ModelsProperty, Tag, SwaggerJson, ClassifiedRequests, RequestWithData, FormattedModelProperty, FormattedModel, Response } from "./types";

export class SwaggerMd {
  private _object: SwaggerJson;
  private _generated: string;
  private _filteredReqs: ClassifiedRequests[];
  private _models: FormattedModel[];

  constructor(body: string) {
    this._object = JSON.parse(body);
    this._generated = "";
    this._filteredReqs = [];
    this._models = [];

    this._filterWithTags();
    this._formatModels();
  }

  private _getTags = (): Tag[] => {
    return this._object.tags;
  }

  private _filterWithTags = (): void => {
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
      this._filteredReqs.push(
        {
          tag,
          requests: reqs
        }
      );
    }
  }

  private _formatModels = (): void => {
    for (const mName in this._object.definitions) {
      let properties: FormattedModelProperty[] = [];
      let model: FormattedModel =
      {
        name: mName,
        type: this._object.definitions[mName].type !== undefined ? this._object.definitions[mName].type : " - ",
        properties
      }
      for (const pName in this._object.definitions[mName].properties) {
        const property: ModelsProperty = this._object.definitions[mName].properties[pName];
        const required =
          this._object.definitions[mName].required != null ?
            this._object.definitions[mName].required.includes(pName) :
            false;
        const ref =
          property.$ref != null ?
            property.$ref.replace("#/definitions/", "") :
            "";

        properties.push(
          {
            name: pName,
            type: property.type !== undefined ? property.type : " - ",
            format: property.format !== undefined ? property.format : " - ",
            example: property.example !== undefined ? property.example : " - ",
            required,
            ref
          }
        );
      }
      this._models.push(model);
    }
  }

  private _printTitle = (): void => {
    this._generated += `# ${this._object.info.title}  \n`;
  }

  private _printVersion = (): void => {
    this._generated += `version: ${this._object.swagger}  \n`;
  }

  private _printRequest = (reqs: RequestWithData[]): void => {
    for (const req of reqs) {
      this._generated += `#### ${req.method} ${req.endpoint}\n`;
      this._generated += `${req.request.description}  \n`;
      if (req.request.parameters == null || req.request.parameters.length <= 0) { }
      else {
        this._generated += `##### Parameters  \n`;
        this._generated += `| Name | Type | Description |\n`;
        this._generated += `|------|------|-------------|\n`;
        for (const param of req.request.parameters) {
          const _type = param.type !== undefined ? param.type : " - ";
          this._generated += `| ${param.name} | ${_type} | ${param.description} |\n`;
        }
        this._generated += `\n`;
      }
      this._generated += `#### Responses  \n`;
      this._generated += `| Code | Description | Schema |\n`;
      this._generated += `|------|-------------|--------|\n`;
      for (const resCode in req.request.responses) {
        const res: Response = req.request.responses[resCode];
        const _description = res.description != null ? res.description : " - ";
        const _schema = res.schema == null ? " - " :
          res.schema.$ref == null ? " - " :
            `[${res.schema.$ref.replace("#/definitions/", "")}](#${res.schema.$ref.replace("#/definitions/", "").toLowerCase()})`;
        this._generated += `| ${resCode} | ${_description} | ${_schema} |\n`;
      }
      this._generated += `\n`;
    }
  }

  private _printRequests = (): void => {
    this._generated += `## Endpoint  \n`;
    for (const reqs of this._filteredReqs) {
      this._generated += `### Tag - ${reqs.tag.name}  \n`;
      this._printRequest(reqs.requests);
    }
  }

  private _printProperties = (properties: FormattedModelProperty[]): void => {
    this._generated += `| Parameter | Type | Example | Required |\n`;
    this._generated += `|-----------|------|---------|----------|\n`;
    for (const property of properties) {
      const typeText: string = this._models.some(e => e.name === property.ref) ? `[${property.ref}](#${property.ref.toLowerCase()})` : `${property.type}`;
      this._generated += `| ${property.name} | ${typeText} | ${property.example} | ${property.required} |\n`;
    }
    this._generated += "\n";
  }

  private _printModels = (): void => {
    this._generated += `## Model  \n`;
    for (const model of this._models) {
      this._generated += `### ${model.name}<a id="${model.name}"></a>  \n`;
      this._printProperties(model.properties);
    }
  }

  output = (): string => {
    this._printTitle();
    this._printVersion();
    this._printRequests();
    this._printModels();
    return this._generated;
  }
}
