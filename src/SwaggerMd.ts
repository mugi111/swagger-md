import { ModelsProperty, Tag, SwaggerJson, ClassifiedRequests, RequestWithData, FormattedModelProperty, FormattedModel, Response } from "./types";

export class SwaggerMd {
  private _object: SwaggerJson;
  private _generated: string;
  private _filteredReqs: ClassifiedRequests[];
  private _models: FormattedModel[];
  private _topLink: string;
  private _tags: string[];

  constructor(body: string) {
    this._object = JSON.parse(body);
    this._generated = "";
    this._filteredReqs = [];
    this._models = [];
    this._topLink = 
      `${this._convertToLink(this._object.info.title)}-${this._convertToLink(this._object.info.version)}`;
    this._tags = this._getTags();
      
    this._filterWithTags();
    this._formatModels();
  }

  private _convertToLink = (s: string): string => {
    return s.replace("\n", "-").replace(/[^a-zA-Z0-9\p{Hiragana}\p{Katakana}\p{Han}]+/g, "").toLowerCase();
  }

  private _getTags = (): string[] => {
    const tags: string[] = [];
    for (const path in this._object.paths) {
      for (const method in this._object.paths[path]) {
        const req = this._object.paths[path][method];
        req.tags.forEach((tag) => {
          if(!tags.includes(tag)){
            tags.push(tag);
          }
        });
      }
    }
    return tags;
  }

  private _filterWithTags = (): void => {
    for (const tag of this._tags) {
      let reqs: RequestWithData[] = []
      for (const path in this._object.paths) {
        for (const method in this._object.paths[path]) {
          if (this._object.paths[path][method].tags.includes(tag)) {
            reqs.push(
              {
                endpoint: path,
                method: method,
                request: this._object.paths[path][method]
              }
            );
          }
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
    for (const mName in this._object.components.schemas) {
      let properties: FormattedModelProperty[] = [];
      let model: FormattedModel =
      {
        name: mName,
        type: this._object.components.schemas[mName].type !== undefined ? this._object.components.schemas[mName].type : " - ",
        properties
      }
      for (const pName in this._object.components.schemas[mName].properties) {
        const property: ModelsProperty = this._object.components.schemas[mName].properties[pName];
        const required =
          this._object.components.schemas[mName].required != null ?
            this._object.components.schemas[mName].required.includes(pName) :
            false;
        const ref =
          property.$ref != null ?
            property.$ref.replace("#/components/schemas/", "") :
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

  private _printInfo = (): void => {
    this._generated += `# ${this._object.info.title} ${this._object.info.version}  \n`;
  }

  private _printRequest = (reqs: RequestWithData[]): void => {
    for (const req of reqs) {
      this._generated += `#### ${req.method.toUpperCase()} ${req.endpoint}\n`;
      this._generated += `${req.request.description !== undefined ? req.request.description: ""}  \n`;
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
            `[${res.schema.$ref.replace("#/components/schemas/", "")}](#${res.schema.$ref.replace("#/components/schemas/", "").toLowerCase()})`;
        this._generated += `| ${resCode} | ${_description} | ${_schema} |\n`;
      }
      this._generated += `[Top](#${this._topLink})  \n`;
      this._generated += `\n`;
    }
  }

  private _printRequests = (): void => {
    this._generated += `## Endpoint  \n`;
    for (const reqs of this._filteredReqs) {
      this._generated += `### ${reqs.tag}  \n`;
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

  private _printSchemas = (): void => {
    this._generated += `## Schema  \n`;
    for (const model of this._models) {
      this._generated += `### ${model.name}  \n`;
      this._printProperties(model.properties);
    }
  }

  private _printContents = (): void => {
    this._filteredReqs.forEach((fReq, i) => {
      this._generated += `- [${fReq.tag}](#${fReq.tag.toLowerCase()})  \n`;
      fReq.requests.forEach((req) => {
        this._generated += `- [${req.method.toUpperCase()} ${req.endpoint}](#${this._convertToLink(req.method)}-${this._convertToLink(req.endpoint)})  \n`;
        this._generated += `\t- [parameters](#parameters${i === 0 ? "" : ("-" + i)})  \n`;
        this._generated += `\t- [responses](#responses${i === 0 ? "" : ("-" + i)})  \n`;  
      });
    });
    this._generated += "[Schema](#schema)  \n";
    this._models.forEach((model) => {
      this._generated += `- [${model.name}](#${model.name.toLowerCase()})  \n`;
    });
  }

  output = (contents: boolean): string => {
    this._printInfo();
    if (contents) this._printContents();
    this._printRequests();
    this._printSchemas();
    return this._generated;
  }
}
