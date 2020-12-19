class SwaggerMd {
  private _object: any;

  constructor(body: string) {
    this._object = JSON.parse(body);
  }
}

module.exports = SwaggerMd;