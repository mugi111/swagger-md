export interface OpenApi {
  openapi: string;
  info: Info;
  servers: Server[] | null | undefined;
  paths: Path;
  components: Components | null | undefined;
  security: any;
  Tags: any;
  externalDocs: any;
}

interface Info {
  title: string;
  description: string | null | undefined;
  termsOfService: string | null | undefined;
  contact: Contact | null | undefined;
  license: License | null | undefined;
  version: string;
}

interface Contact {
  name: string | null | undefined;
  url: string | null | undefined;
  email: string | null | undefined;
}

interface License {
  name: string;
  url: string | null | undefined;
}

interface Server {
  url: string;
  description: string | null | undefined;
  variables: ServerVariable[] | null | undefined;
}

interface ServerVariable {
  [key: string]: ServerVariableObject;
}

interface ServerVariableObject {
  enum: string[];
  default: string;
  description: string | null | undefined;
}

interface Path {
  [key: string]: PathItemObject;
}

export interface PathItemObject {
  $ref: string | null | undefined;
  summary: string | null | undefined;
  description: string | null | undefined;
  get: OperationObject | null | undefined;
  put: OperationObject | null | undefined;
  post: OperationObject | null | undefined;
  delete: OperationObject | null | undefined;
  options: OperationObject | null | undefined;
  head: OperationObject | null | undefined;
  patch: OperationObject | null | undefined;
  trace: OperationObject | null | undefined;
  servers: Server[] | null | undefined;
  parameters: (ParameterObject | ReferenceObject)[] | null | undefined;
}

export interface OperationObject {
  tags: string[];
  summary: string | null | undefined;
  description: string | null | undefined;
  externalDocs: any;
  operationId: string | null | undefined;
  parameters: (ParameterObject | ReferenceObject)[] | null | undefined;
  requestBody: RequestBodyObject | ReferenceObject | null | undefined;
  responses: ResponseObject[];
  callbacks: any;
  deprecated: boolean;
  security: any;
  servers: Server[];
}

interface ParameterObject {
  name: string;
  in: string;
  description: string | null | undefined;
  required: boolean | null | undefined;
  deprecated: boolean | null | undefined;
  allowEmptyValue: boolean | null | undefined;
  style: string | null | undefined;
  explode: boolean | null | undefined;
  allowReserved: boolean | null | undefined;
  schema: SchemaObject | ReferenceObject | null | undefined;
  example: any;
  examples: any[];
  content: any;
}

export interface SchemaObject {
  title: string;
  type: string;
  required: string[] | null | undefined;
  enum: any[];
  properties: { [key: string]: SchemaObject };
  description: string;
  nullable: boolean | null | undefined;
  discriminator: any;
  readOnly: boolean | null | undefined;
  writeOnly: boolean | null | undefined;
  xml: any;
  externalDocs: any;
  example: any;
  deprecated: boolean | null | undefined;
  items: SchemaObject | null | undefined;
  $ref: string;
}

export interface ReferenceObject {
  $ref: string;
}

export interface ResponseObject {
  description: string;
  headers: Header[] | null | undefined;
  content: { [key: string]: MediaTypeObject } | null | undefined;
  links: Link[] | null | undefined;
}

interface Header {
  [key: string]: (ParameterObject | ReferenceObject);
}

interface MediaTypeObject {
  schema: (SchemaObject | ReferenceObject);
  example: any;
  examples: { [key: string]: ExampleObject | ReferenceObject };
  encoding: any;
}

interface Link {
  [key: string]: (LinkObject | ReferenceObject);
}

interface LinkObject {

}

interface Components {
  schemas: { [key: string]: SchemaObject | ReferenceObject };
  reposnses: { [key: string]: ResponseObject | ReferenceObject };
  parameters: { [key: string]: ParameterObject | ReferenceObject };
  examples: { [key: string]: ExampleObject | ReferenceObject };
  requestBodies: { [key: string]: RequestBodyObject | ReferenceObject };
  headers: any;
  securitySchemas: any;
  links: any;
  callbacks: any;
}

interface ExampleObject {
  summary: string | null | undefined;
  description: string | null | undefined;
  value: any;
  externalValue: string | null | undefined;
}

interface RequestBodyObject {
  description: string | null | undefined;
  content: { [key: string]: MediaTypeObject };
  required: boolean | null | undefined;
}

export interface FormattedSchema {
  name: string;
  type: string;
  depricated: boolean;
  properties: FormattedProperty[];
}

export interface FormattedProperty {
  name: string;
  type: string;
  description: string;
  example: string;
  required: boolean;
  ref: string;
}

export interface FormattedEnum {
  name: string;
  description: string;
  value: any[];
}

export interface FilteredRequest {
  tag: string;
  requests: RequestData[];
}

export interface RequestData {
  endpoint: string;
  method: string;
  request: OperationObject;
}