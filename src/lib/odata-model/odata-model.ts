import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ODataEntityService } from '../odata-service/odata-entity.service';

export class Schema {
  fields: any[];
  relationships: any[];
  defaults: any;

  static create(opts: { fields?: any[], relationships?: any[], defaults?: any }) {
    return Object.assign(new Schema(), { fields: [], relationships: [], defaults: {} }, opts);
  }

  extend(opts: { fields?: any[], relationships?: any[], defaults?: any }) {
    let { fields, relationships, defaults } = this;
    fields = [...fields, ...(opts.fields || [])];
    relationships = [...relationships, ...(opts.relationships || [])];
    defaults = Object.assign({}, defaults, opts.defaults || {});
    return Object.assign(new Schema(), { fields, relationships, defaults });
  }

  attrs(value: any, parse: boolean) {
    let attrs = parse ? this.parse(value) : value;
    return Object.assign({}, this.defaults, attrs);
  }

  parse(value) {
    return value;
  }

  json(model) {
    return model;
  }
}

export class Model {
  static schema: Schema = null;

  constructor(value: any, opts: { parse: boolean }) {
    let ctor = <typeof Model>this.constructor;
    Object.assign(this, ctor.schema.attrs(value, opts.parse));
  }

  toJSON() {
    let ctor = <typeof Model>this.constructor;
    return ctor.schema.json(this);
  }
}

export class ODataModel extends Model {
  service: ODataEntityService<ODataModel>;

  constructor(value: any, opts: { parse: boolean, service: ODataEntityService<ODataModel> }) {
    super(value, opts)
    this.service = opts.service;
  }

  toEntity() {
    return this.toJSON();
  }

  fetch(options: { parse?: boolean }): Observable<ODataModel> {
    let ctor = <typeof ODataModel>this.constructor;
    let entity = this.toEntity();
    return this.service.fetch(entity, options)
      .pipe(
        map(attrs => Object.assign(this, ctor.schema.attrs(attrs, options.parse)))
      );
  }

  save(options: { parse?: boolean }): Observable<ODataModel> {
    let ctor = <typeof ODataModel>this.constructor;
    let entity = this.toEntity();
    return this.service.save(entity, options)
      .pipe(
        map(attrs => Object.assign(this, ctor.schema.attrs(attrs, options.parse)))
      );
  }

  destroy(options?: any): Observable<any> {
    let entity = this.toEntity();
    return this.service.destroy(entity, options);
  }
}