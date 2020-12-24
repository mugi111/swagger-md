export interface Contact {
  email: string;
}

export interface License {
  name: string;
  url: string;
}

interface ExternalDocs {
  description: string;
  url: string;
}

export interface Tag {
  name: string;
  description: string;
  externalDocs: ExternalDocs;
}

enum Produce {
  "application/json",
  "application/xml"
}

interface Item {
  type: string;
  enum: string[];
  default: string;
}

interface Parameter {
  name: string;
  in: string;
  description: string;
  required: boolean;
  type: string;
  items: Item[];
  collectionFormat: string;
}

interface ResSchema {
  $ref: string;
}

export interface Response {
  description: string;
  header: any;
  schema: ResSchema;
  security: { [key: string]: string[] }
}

export interface Responses {
  [key: string]: Response;
}

export interface Request {
  tags: Tag[];
  summary: string;
  description: string;
  operationId: string;
  produces: Produce[];
  parameters: Parameter[];
  responses: Responses;
  deprecated: boolean;
}

export interface RequestWithData {
  endpoint: string;
  method: string;
  request: Request;
}

export interface ClassifiedRequests {
  tag: Tag;
  requests: RequestWithData[];
}

export interface Paths {
  [key: string]: { [key: string]: Request };
}

export interface Property {
  type: string;
  format: string;
  description: string;
  enum: string[];
}
interface Xml {
  name: string;
}

export interface ModelsProperty {
  type: string;
  format: string;
  example: string;
  $ref: string;
  xml: Xml;
}

export interface Model {
  type: string;
  required: string[];
  properties: { [key: string]: ModelsProperty };
}

export interface FormattedModelProperty {
  name: string;
  type: string;
  format: string;
  example: string;
  required: boolean;
  ref: string;
}

export interface FormattedModel {
  name: string;
  type: string;
  properties: FormattedModelProperty[];
}

export interface Info {
  description: string;
  version: string;
  title: string;
  termsOfService: string;
  contact: Contact;
  license: License;
}

export interface SwaggerJson {
  swagger: string;
  info: Info,
  host: string;
  basePath: string;
  tags: Tag[];
  schemes: string[];
  paths: any;
  securityDefinitions: any;
  definitions: { [key: string]: Model };
}