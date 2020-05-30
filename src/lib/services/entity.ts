import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { 
  ODataNavigationPropertyResource, 
  ODataPropertyResource, 
  ODataActionResource, 
  ODataFunctionResource, 
  ODataEntitiesAnnotations, 
  ODataEntityAnnotations 
} from '../resources';
import { EntityKey } from '../types';
import { ODataClient } from '../client';

import { ODataBaseService } from './base';

@Injectable()
export class ODataEntityService<T> extends ODataBaseService<T> {
  constructor(protected client: ODataClient) { super(client); }

  public navigationProperty<P>(key: EntityKey<T>, name: string): ODataNavigationPropertyResource<P> {
    return this.entity(key).navigationProperty<P>(name);
  }

  public property<P>(key: EntityKey<T>, name: string): ODataPropertyResource<P> {
    return this.entity(key).property<P>(name);
  }

  public action<R>(key: EntityKey<T>, name: string, returnType?: string): ODataActionResource<R> {
    return this.entity(key).action<R>(name, returnType);
  }

  public collectionAction<R>(name: string, returnType?: string): ODataActionResource<R> {
    return this.entities().action<R>(name, returnType);
  }

  public function<R>(key: EntityKey<T>, name: string, returnType?: string): ODataFunctionResource<R> {
    return this.entity(key).function<R>(name, returnType);
  }

  public collectionFunction<R>(name: string, returnType?: string): ODataFunctionResource<R> {
    return this.entities().function<R>(name, returnType);
  }

  // Entity Actions
  public fetchCollection(): Observable<[T[], ODataEntitiesAnnotations]> {
    return this.entities()
      .get();
  }

  public fetchAll(): Observable<T[]> {
    return this.entities()
      .all();
  }

  public fetchOne(key: EntityKey<T>): Observable<[T, ODataEntityAnnotations]> {
    return this.entity(key)
      .get();
  }

  public create(entity: Partial<T>): Observable<[T, ODataEntityAnnotations]> {
    return this.entities()
      .post(entity);
  }

  public update(entity: Partial<T>, etag?: string): Observable<[T, ODataEntityAnnotations]> {
    return this.entity(entity)
      .put(entity, {etag});
  }

  public assign(entity: Partial<T>, etag?: string): Observable<[T, ODataEntityAnnotations]> {
    return this.entity(entity as EntityKey<T>)
      .patch(entity, {etag});
  }

  public destroy(entity: T, etag?: string) {
    return this.entity(entity)
      .delete({etag});
  }

  // Shortcuts
  public fetchOrCreate(entity: Partial<T>): Observable<[T, ODataEntityAnnotations]> {
    return this.fetchOne(entity as EntityKey<T>)
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 404)
          return this.create(entity as T);
        else
          return throwError(error);
      }));
  }

  public save(entity: Partial<T>) {
    return this.entity(entity).hasKey() ? this.update(entity) : this.create(entity);
  }
}
