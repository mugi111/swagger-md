import { OpenApi, FormattedSchema, FormattedEnum, PathItemObject, OperationObject, FilteredRequest, RequestData, SchemaObject, ReferenceObject, FormattedProperty, ResponseObject } from "./types";
import * as http from "http";

export class SwaggerMd {
  private _object: OpenApi;
  private _generated: string;
  private _req: FilteredRequest[];
  private _schemas: FormattedSchema[];
  private _enums: FormattedEnum[];
  private _topLink: string;
  private _tags: string[];

  constructor(body: string) {
    this._object = JSON.parse(body);
    this._generated = "";
    this._req = [];
    this._schemas = [];
    this._enums = [];
    this._topLink = 
      `${this._convertToLink(this._object.info.title)}-${this._convertToLink(this._object.info.version)}`;
    this._tags = this._getTags();
      
    this._filterWithTags();
    this._formatSchemas();
  }

  private _convertToLink = (s: string): string => {
    return s.replace("\n", "-").replace(/[^a-zA-Z0-9]+/g, "").toLowerCase();
  }

  private _getTags = (): string[] => {
    const tags: string[] = [];
    for (const path in this._object.paths) {
      for (const method in this._object.paths[path]) {
        const key = method as (keyof PathItemObject);
        const req = this._object.paths[path][key];
        if (http.METHODS.includes(key.toUpperCase())) {
          (req as OperationObject).tags.forEach((tag) => {
            if(!tags.includes(tag)){
              tags.push(tag);
            }
          });
        }
      }
    }
    return tags;
  }

  private _filterWithTags = (): void => {
    for (const tag of this._tags) {
      let reqs: RequestData[] = []
      for (const path in this._object.paths) {
        for (const method in this._object.paths[path]) {
          const key = method as (keyof PathItemObject);
          const req = this._object.paths[path][key];
          if ((req as OperationObject).tags.includes(tag)) {
            reqs.push(
              {
                endpoint: path,
                method: method,
                request: req as OperationObject
              }
            );
          }
        }
      }
      this._req.push(
        {
          tag,
          requests: reqs
        }
      );
    }
  }

  private _formatSchemas = (): void => {
    for (const sn in this._object.components?.schemas) {
      const asSchema = this._object.components?.schemas[sn] as SchemaObject;
      if (asSchema.type != undefined) {
        let properties: FormattedProperty[] = [];
        let s: FormattedSchema =
        {
          name: sn,
          type: asSchema.type !== undefined ? asSchema.type : " - ",
          depricated: asSchema.deprecated != null ? asSchema.deprecated : false,
          properties
        }
        for (const pn in asSchema.properties) {
          const property: SchemaObject = asSchema.properties[pn];
          const required =
            asSchema.required != null ?
            asSchema.required.includes(pn) :
            false;
          const ref = property.$ref == null ? "" : property.$ref.replace("#/components/schemas/", "");
          properties.push(
            {
              name: pn,
              type: property.type !== undefined ? property.type : " - ",
              description: property.description !== undefined ? property.description : " - ",
              example: property.example !== undefined ? property.example : " - ",
              required,
              ref 
            }
          );
        }
        this._schemas.push(s);
      } else {
        let e: FormattedEnum = 
        {
          name: sn,
          description: asSchema.description,
          value: asSchema.enum
        }
        this._enums.push(e);
      }
    }
  }

  private _printInfo = (): void => {
    this._generated += `# ${this._object.info.title} ${this._object.info.version}  \n`;
  }

  private _printRequest = (reqs: RequestData[]): void => {
    for (const req of reqs) {
      this._generated += `#### ${req.method.toUpperCase()} ${req.endpoint}\n`;
      this._generated += `${req.request.description !== undefined ? req.request.description: ""}  \n`;
      if (req.request.parameters == null || req.request.parameters.length <= 0) { }
      else {
        this._generated += `##### Parameters  \n`;
        this._generated += `| Name | In | Description |\n`;
        this._generated += `|------|----|-------------|\n`;
        req.request.parameters.forEach((param: any) => {
          let _in = param.in === "path" ? "route" : param.in;
          const _description = param.type != undefined ? param.description : " - ";
          this._generated += `| ${param.name} | ${_in} | ${_description} |\n`;
        });
        this._generated += `\n`;
      }
      this._generated += `#### Responses  \n`;
      this._generated += `| Code | Description | Type | Schema |\n`;
      this._generated += `|------|-------------|------|--------|\n`;
      for (const code in req.request.responses) {
        const res: ResponseObject = req.request.responses[code];
        const _description = res.description != null ? res.description : " - ";
        for (const _type in res.content) {
          const _schema = res.content[_type] == null ? " - " :
            res.content[_type].schema == null ? " - " :
              `[${res.content[_type].schema.$ref?.replace("#/components/schemas/", "")}](#${res.content[_type].schema.$ref?.replace("#/components/schemas/", "").toLowerCase()})`;
          this._generated += `| ${code} | ${_description} | ${_type} | ${_schema} |\n`;
        }
      }
      this._generated += `\n[Top](#${this._topLink})  \n`;
      this._generated += `\n`;
    }
  }

  private _printRequests = (): void => {
    this._generated += `## Endpoint  \n`;
    for (const reqs of this._req) {
      this._generated += `### ${reqs.tag}  \n`;
      this._printRequest(reqs.requests);
    }
  }

  private _printProperties = (properties: FormattedProperty[]): void => {
    this._generated += `| Parameter | Type | description | Example | Required |\n`;
    this._generated += `|-----------|------|-------------|---------|----------|\n`;
    for (const property of properties) {
      const typeText: string = this._schemas.some(e => e.name === property.ref) ? `[${property.ref}](#${property.ref.toLowerCase()})` : `${property.type}`;
      this._generated += `| ${property.name} | ${typeText} | ${property.description} | ${property.example} | ${property.required} |\n`;
    }
    this._generated += "\n";
  }

  private _printSchemas = (): void => {
    this._generated += `## Schema  \n`;
    for (const schema of this._schemas) {
      this._generated += `### ${schema.name}  \n`;
      this._printProperties(schema.properties);
    }
  }

  // private _printContents = (): void => {
  //   this._filteredReqs.forEach((fReq, i) => {
  //     this._generated += `[${fReq.tag}](#${fReq.tag.toLowerCase()})  \n`;
  //     fReq.requests.forEach((req) => {
  //       this._generated += `- [${req.method.toUpperCase()} ${req.endpoint}](#${this._convertToLink(req.method)}-${this._convertToLink(req.endpoint)})  \n`;
  //       this._generated += `\t- [parameters](#parameters${i === 0 ? "" : ("-" + i)})  \n`;
  //       this._generated += `\t- [responses](#responses${i === 0 ? "" : ("-" + i)})  \n`;
  //     });
  //     this._generated += "  \n";
  //   });
  //   this._generated += "[Schema](#schema)  \n";
  //   this._models.forEach((model) => {
  //     this._generated += `- [${model.name}](#${model.name.toLowerCase()})  \n`;
  //   });
  //   this._generated += "[Enum](#enum)  \n";
  //   this._enums.forEach((e) => {
  //     this._generated += `- [${e.name}](#${e.name.toLowerCase()})  \n`
  //   });
  // }

  // private _printEnums = (): void => {
  //   this._generated += `## Enum  \n`;
  //   this._enums.forEach(e => {
  //     this._generated += `### ${e.name}  \n`;
  //     this._printEnum(e.value);
  //   })
  // }

  // private _printEnum = (value: any[]): void => {
  //   this._generated += `| value |\n`;
  //   this._generated += `|-------|\n`;
  //   value.forEach(v => {
  //     this._generated += `| ${v} |\n`;
  //   })
  //   this._generated += "\n";
  // }

  output = (contents: boolean): void => {
    this._printInfo();
    // if (contents) this._printContents();
    this._printRequests();
    this._printSchemas();
    // this._printEnums();
    // return this._generated;
  }
}
