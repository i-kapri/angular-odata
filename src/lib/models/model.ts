import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ODataEntityResource, Expand, ODataPropertyResource, ODataEntityAnnotations, ODataPropertyAnnotations, ODataRelatedAnnotations, ODataFunctionResource, ODataActionResource } from '../resources';

import { ODataModelCollection } from './collection';
import { ODataNavigationPropertyResource } from '../resources/requests/navigationproperty';
import { PlainObject } from '../types';
import { Parser } from './parser';
import { ODataClient } from '../client';
import { ODataSchema } from './schema';
import { Types } from '../utils/types';

export type ODataModelResource<T> = ODataEntityResource<any> | ODataPropertyResource<any> | ODataNavigationPropertyResource<any>;
export type ODataModelAnnotations = ODataEntityAnnotations | ODataPropertyAnnotations | ODataRelatedAnnotations;

export class ODataModel {
  _client: ODataClient;
  _resource: ODataModelResource<any>;
  _annotations: ODataModelAnnotations;
  _relationships: { [name: string]: ODataModel | ODataModelCollection<ODataModel> }

  constructor(
    entity: any | null,
    annots: ODataModelAnnotations | null,
    resource: ODataModelResource<any>,
    client: ODataClient
  ) {
    this._client = client;
    this.assign(entity || {}, annots, resource);
  }

  fromEntity(entity: any): this {
    var schema = this._client.parserForType(this._resource.type()) as ODataSchema<any>;
    schema.fields.forEach(field => {
      let value = entity[field.name];
      let modelFactory = (annots, resource) => field.collection ?
        this._client.collectionForType(value, annots, resource, field.type) :
        this._client.modelForType(value, annots, resource, field.type);
      if (field.navigation) {
        Object.defineProperty(this, field.name, {
          get() {
            if (!(field.name in this._relationships)) {
              let resource: ODataEntityResource<any> = this._resource.clone();
              resource.key(this);
              if (!this._annotations.context) {
                throw new Error(`Can't resolve ${field.name} relation from new entity`);
              }
              this._relationships[field.name] = modelFactory(
                this._annotations.related(field.name),
                (resource as ODataEntityResource<any>).navigationProperty<any>(field.name)
              );
            }
            return this._relationships[field.name];
          },
          set(value: ODataModel | null) {
            if (field.collection)
              throw new Error(`Can't set ${field.name} to collection, use add`);
            if (!(value._resource instanceof ODataEntityResource))
              throw new Error(`Can't set ${value} to model`);
            this._relationships[field.name] = value;
          }
        });
      } else if (field.schema) {
        this[field.name] = modelFactory(
          <any>this._annotations.property(field.name),
          this._resource.property(field.name)
        );
      } else if (value !== undefined) {
        this[field.name] = value;
      }
    });
    return this;
  }

  toEntity() {
    let entity = {};
    let schema = this._client.parserForType(this._resource.type()) as ODataSchema<any>;
    schema.fields.forEach(field => {
      if (field.navigation) {
        if (field.name in this._relationships)
          entity[field.name] = this._relationships[field.name].toJSON();
      } else if (field.schema) {
        if (this[field.name] !== undefined)
          entity[field.name] = this[field.name].toJSON();
      } else if (this[field.name] !== undefined) {
        entity[field.name] = this[field.name];
      }
    }, {});
    return entity;
  }

  annotate(annots: ODataModelAnnotations): this {
    this._annotations = annots;
    return this;
  }

  attach(resource: ODataModelResource<any>): this {
    if (this._resource && this._resource.type() !== resource.type())
      throw new Error(`Can't attach resource from distinct type`);
    this._resource = resource;
    this._relationships = {};
    return this;
  }

  assign(entity: any,
    annots: ODataModelAnnotations,
    resource: ODataModelResource<any>
  ): this {
    return this.annotate(annots).attach(resource).fromEntity(entity);
  }

  toJSON(): PlainObject {
    return this._resource.serialize(this);
  }

  clone() {
    let Ctor = <typeof ODataModel>this.constructor;
    let resource = this._resource.clone() as ODataEntityResource<any> | ODataNavigationPropertyResource<any>;
    return new Ctor(this.toJSON(), this._annotations.clone(), resource, this._client);
  }

  fetch(): Observable<this | null> {
    let resource: ODataEntityResource<any> | ODataPropertyResource<any> | ODataNavigationPropertyResource<any> = this._resource.clone<any>() as ODataEntityResource<any> | ODataNavigationPropertyResource<any>;
    if (resource instanceof ODataEntityResource) {
      resource.key(this);
      if (resource.key())
        throw new Error(`Can't fetch without entity key`);
    }
    return resource.get({ responseType: 'entity' })
      .pipe(
        map(([entity, annots]) => entity ? this.assign(entity, annots, resource) : null));
  }

  save(): Observable<this> {
    let resource = this._resource.clone() as ODataEntityResource<any>;
    /*
    let obs$ = of(this.toJSON());
    let changes = Object.keys(this._relationships)
      .filter(k => this._relationships[k] === null || this._relationships[k] instanceof ODataModel);
    changes.forEach(name => {
      let model = this._relationships[name] as ODataModel;
      let q = query.clone() as ODataEntityResource<any>;
      q.key(this);
      let ref = q.navigationProperty(name).ref();
      if (model === null) {
        // Delete 
        obs$ = obs$.pipe(switchMap((attrs: PlainObject) =>
          q.delete(attrs[ODATA_ETAG])
            .pipe(map(resp =>
              Object.assign(attrs, { [ODATA_ETAG]: resp[ODATA_ETAG] })
            ))
        ));
      } else {
        // Create
        let target = model._query.clone() as ODataEntityResource<any>;
        target.key(model)
        obs$ = obs$.pipe(switchMap((attrs: PlainObject) =>
          ref.put(target, attrs[ODATA_ETAG])
            .pipe(map(resp =>
              Object.assign(attrs, { [ODATA_ETAG]: resp[ODATA_ETAG] })
            ))
        ));
      }
    });
    */
    if (this._annotations.context) {
      resource.key(this);
      return resource.put(this.toEntity())
        .pipe(map(([entity, annots]) => {
          this.assign(entity, annots, resource);
          return this;
        }));
    } else {
      return resource.post(this.toEntity())
        .pipe(map(([entity, annots]) => {
          this.assign(entity, annots, resource);
          return this;
        }));
    }
  }

  destroy(): Observable<any> {
    let resource = this._resource.clone() as ODataEntityResource<any>;
    if (resource instanceof ODataEntityResource) {
      resource.key(this);
      if (resource.hasKey()) {
        let etag = (this._annotations as ODataEntityAnnotations).etag;
        return resource.delete({ etag });
      }
    }
    throw new Error(`Can't destroy without entity and key`);
  }

  // Custom
  protected function<R>(name: string, params: any, returnType?: string): ODataFunctionResource<R> {
    let resource = this._resource.clone() as ODataEntityResource<any>;
    if (resource instanceof ODataEntityResource) {
      resource.key(this);
      if (resource.hasKey()) {
        let parser = returnType ? this._client.parserForType<R>(returnType) as Parser<R> : null;
        var func = resource.function<R>(name, parser);
        func.parameters(params);
        return func;
      }
    }
  }

  protected action<R>(name: string, returnType?: string): ODataActionResource<R> {
    let resource = this._resource.clone() as ODataEntityResource<any>;
    if (resource instanceof ODataEntityResource) {
      resource.key(this);
      if (resource.hasKey()) {
        let parser = returnType ? this._client.parserForType<R>(returnType) as Parser<R> : null;
        return resource.action<R>(name, parser);
      }
    }
  }

  // Mutate query
  select(select?: string | string[]) {
    return (this._resource as ODataEntityResource<any>).select(select);
  }

  expand(expand?: Expand) {
    return (this._resource as ODataEntityResource<any>).expand(expand);
  }
}
