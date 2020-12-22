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

interface Schema {
  type: string;
  items: { [key: string]: string; },
}

interface ResponseBody {
  description: string;
  header: any;
  schema: Schema;
  security: { [key: string]: string[] }
}

interface Response {
  [key: string]: ResponseBody;
}

export interface Request {
  tags: Tag[];
  summary: string;
  description: string;
  operationId: string;
  produces: Produce[];
  parameters: Parameter[];
  responses: Response[];
  deprecated: boolean;
}

export interface ClassifiedRequest extends Tag, Request {
  endpoint: string;
}

export interface Paths {
  [key: string]: { [key: string]: Request };
}

export interface Proparty {
  type: string;
  format: string;
  description: string;
  enum: string[];
}
interface Xml {
  name: string;
}

interface Model {
  type: string;
  properties: any;
  xml: Xml;
}

export interface Definitions {
  [key: string]: { [key: string]: Model };
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
  definitions: any;
}