import { Parser, PARSERS } from './parser';
import { ODataSettings } from './settings';
import { Types, Enums } from '../utils';
import { PlainObject } from '../types';

export interface Field {
  type: string;
  enum?: { [key: number]: string | number };
  schema?: ODataSchema<any>;
  ctor?: { new(attrs: PlainObject | PlainObject[]): any };
  enumString?: boolean;
  default?: any;
  maxLength?: number;
  isKey?: boolean;
  isCollection?: boolean;
  isNullable?: boolean;
  isFlags?: boolean;
  isNavigation?: boolean;
  field?: string;
  ref?: string;
}

class ODataSchemaField<T> implements Field, Parser<T> {
  name: string;
  type: string;
  enum?: { [key: number]: string | number };
  schema?: ODataSchema<any>;
  model?: { new(...any): any };
  collection?: { new(...any): any };
  enumString?: boolean;
  default?: any;
  maxLength?: number;
  isKey?: boolean;
  isCollection?: boolean;
  isNullable?: boolean;
  isFlags?: boolean;
  isNavigation?: boolean;
  field?: string;
  ref?: string;

  constructor(name: string, field: Field) {
    this.name = name;
    Object.assign(this, field);
  }

  resolve(value: any) {
    return this.ref.split('/').reduce((acc, name) => acc[name], value);
  }

  parse(value: any) {
    if (value === null) return value;
    if (this.enum) {
      //TODO: enumString
      return this.isFlags ?
        Enums.toFlags(this.enum, value) :
        Enums.toValue(this.enum, value);
    } else if (this.schema) {
      value = this.schema.parse(value);
      if (this.model) {
        value = new this.model(value);
      } else if (this.collection)
        value = new this.collection(value);
      return value;
    } else if (this.type in PARSERS) {
      return PARSERS[this.type].parse(value);
    }
    return value;
  }

  toJSON(value: any) {
    if (value === null) return value;
    if (this.enum) {
      let enums = this.isFlags ?
        Enums.toEnums(this.enum, value) :
        [Enums.toEnum(this.enum, value)];
      if (!this.enumString)
        enums = enums.map(e => `${this.type}'${e}'`);
      return enums.join(", ");
    } else if (this.model) {
      return value.toJSON();
    } else if (this.collection) {
      return value.toJSON();
    } else if (this.schema) {
      return this.schema.toJSON(value);
    } else if (this.type in PARSERS) {
      return PARSERS[this.type].toJSON(value);
    }
    return value;
  }

  parserFor<E>(name: string): Parser<E> {
    return this.schema.parserFor(name);
  }

  resolveKey(attrs: any) {
    return this.schema.resolveKey(attrs);
  }
}

export class ODataSchema<Type> implements Parser<Type> {
  type: string;
  fields: ODataSchemaField<any>[];
  get keys() { return this.fields.filter(f => f.isKey); }
  model?: { new(...any): any };

  constructor(fields: { [name: string]: Field }) {
    this.fields = Object.entries(fields)
      .map(([name, f]) => new ODataSchemaField(name, f));
  }

  configure(type: string, settings: ODataSettings) {
    this.type = type;
    if (this.type in settings.models) {
      this.model = settings.models[this.type];
    }
    this.fields.forEach(f => {
      if (f.type in settings.enums) {
        f.enum = settings.enums[f.type];
        f.enumString = settings.stringAsEnum;
      }
      if (f.type in settings.schemas) {
        f.schema = settings.schemas[f.type] as ODataSchema<any>;
      }
      if (f.type in settings.models) {
        f.model = settings.models[f.type];
      }
      if (f.type in settings.collections) {
        f.collection = settings.collections[f.type];
      }
    });
  }

  toJSON(objs: any): any {
    let _toJSON = (obj) => Object.assign(obj, this.fields
      .filter(f => f.name in obj)
      .reduce((acc, f) => Object.assign(acc, { [f.name]: f.toJSON(obj[f.name]) }), {})
    );
    return Array.isArray(objs) ? 
      objs.map(obj => _toJSON(obj)) :
      _toJSON(objs);
  }

  parse(objs: any): any {
    let _parse = (obj) =>
      Object.assign(obj, this.fields
        .filter(f => f.name in obj)
        .reduce((acc, f) => Object.assign(acc, { [f.name]: f.parse(obj[f.name]) }), {})
      );
    return Array.isArray(objs) ?
      objs.map(obj => {
        let attrs = _parse(obj);
        return (this.model) ?
          new this.model(attrs) :
          attrs;
      }) :
      _parse(objs);
  }

  parserFor<E>(name: string): Parser<E> {
    return this.fields.find(f => f.name === name) as Parser<E>;
  }

  resolveKey(attrs: any) {
    let key = this.keys
      .reduce((acc, f) => Object.assign(acc, { [f.name]: f.resolve(attrs) }), {});
    if (Object.keys(key).length === 1)
      key = Object.values(key)[0];
    if (!Types.isEmpty(key))
      return key;
  }

  isComplex() {
    return this.fields.every(f => !f.isKey);
  }

  /*
      query = this.isNavigation ?
        (query as ODataEntityResource<any>).navigationProperty<any>(this.name) :
        (query as ODataEntityResource<any>).property<any>(this.name);

relationships(obj: Type, query: ODataRequest<any>) {
(obj as any).relationships = {};
this.navigations().forEach(field => {
Object.defineProperty(obj, field.name, {
get() {
  if (!(field.name in this.relationships)) {
    let query: ODataEntityRequest<Type> | ODataNavigationPropertyRequest<Type> = this.query.clone();
    if (query instanceof ODataEntityRequest) {
      if (this.isNew())
        throw new Error(`Can't resolve ${field.name} relation from new entity`);
      query.key(this.resolveKey());
    }
    let nav = query.navigationProperty<any>(field.name);
    this.relationships[field.name] = field.parse(obj[field.name], nav);
  }
  return this.relationships[field.name];
},
set(value: Type | null) {
  if (field.isCollection)
    throw new Error(`Can't set ${field.name} to collection, use add`);
  if (!((value as any).query instanceof ODataEntityRequest))
    throw new Error(`Can't set ${value} to model`);
  this.relationships[field.name] = value;
  let query = this._query.clone() as ODataQueryBuilder;
  query.entityKey(this.resolveKey());
  query.navigationProperty(field.name);
  this._relationships[field.name] = this._context.createInstance(
    field.type, value !== null ? value.toJSON() : {}, query);
  this.setState(ModelState.Modified);
  this._relationships[field.name].setState(value !== null ? ModelState.Added : ModelState.Deleted);
}
});
});
}
*/
}