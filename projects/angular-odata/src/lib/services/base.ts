import { ODataEntitySetResource, ODataEntityResource } from '../resources';
import { ODataClient } from "../client";
import { EntityKey } from '../types';

export class ODataBaseService<T> {
  static path: string = "";
  static type: string = "";
  static entity: string = "";

  constructor(protected client: ODataClient) { }

  // Build resources
  public entities(): ODataEntitySetResource<T> {
    let Ctor = <typeof ODataBaseService>this.constructor;
    return this.client.entitySet<T>(Ctor.path, Ctor.entity);
  }

  public entity(key?: EntityKey<T>): ODataEntityResource<T> {
    return this.entities()
      .entity(key);
  }

  // Get base type data
  public config() {
    let Ctor = <typeof ODataBaseService>this.constructor;
    return this.client.serviceConfigForType(Ctor.type);
  }
}