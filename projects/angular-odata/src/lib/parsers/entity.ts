import { Types } from '../utils';
import { Parser, Field, JsonSchemaExpandOptions, JsonSchemaConfig, EntityConfig, ParseOptions, odataType } from '../types';

const NONE_PARSER = {
  deserialize: (value: any, options: ParseOptions) => value,
  serialize: (value: any, options: ParseOptions) => value
} as Parser<any>;

export class ODataFieldParser<Type> implements Parser<Type> {
  name: string;
  type: string;
  private parser?: Parser<Type>;
  default?: any;
  maxLength?: number;
  key?: boolean;
  collection?: boolean;
  nullable?: boolean;
  navigation?: boolean;
  field?: string;
  precision?: number;
  scale?: number;
  ref?: string;

  constructor(name: string, field: Field) {
    this.name = name;
    this.type = field.type;
    Object.assign(this, field);
  }

  resolve(value: any) {
    return this.ref.split('/').reduce((acc, name) => acc[name], value);
  }

  // Deserialize
  private parse(parser: ODataEntityParser<Type>, value: any, options: ParseOptions): any {
    const type = Types.isObject(value) ? odataType(value) : undefined;
    if (!Types.isUndefined(type) && parser.type !== type) {
      return parser.findParser(c => c.type === type).deserialize(value, options);
    }
    return parser.deserialize(value, options);
  }

  deserialize(value: any, options: ParseOptions): Type {
    const parser = this.parser;
    if (parser instanceof ODataEntityParser) {
      return Array.isArray(value) ? 
        value.map(v => this.parse(parser, v, options)) : 
        this.parse(parser, value, options);
    }
    return parser.deserialize(value, options);
  }

  // Serialize
  private toJson(parser: ODataEntityParser<Type>, value: any, options: ParseOptions): any {
    const type = Types.isObject(value) ? odataType(value) : undefined;
    if (!Types.isUndefined(type) && parser.type !== type) {
      return parser.findParser(c => c.type === type).serialize(value, options);
    }
    return parser.serialize(value, options);
  }

  serialize(value: Type, options: ParseOptions): any {
    const parser = this.parser;
    if (parser instanceof ODataEntityParser) {
      return Array.isArray(value) ?
        value.map(v => this.toJson(parser, v, options)) :
        this.toJson(parser, value, options);
    }
    return parser.serialize(value, options);
  }

  configure(settings: { parserForType: (type: string) => Parser<any> }) {
    this.parser = settings.parserForType(this.type) || NONE_PARSER;
  }

  // Json Schema
  toJsonSchema(options: JsonSchemaExpandOptions<Type> = {}) {
    let property = this.parser instanceof ODataEntityParser ? this.parser.toJsonSchema(options) : <any>{
      title: `The ${this.name} field`,
      type: this.parser ? "object" : this.type
    };
    if (this.maxLength)
      property.maxLength = this.maxLength;
    if (this.collection)
      property = {
        type: "array",
        items: property,
        additionalItems: false
      };
    return property;
  }

  isNavigation() {
    return this.navigation;
  }

  isComplexType() {
    return this.parser instanceof ODataEntityParser && this.parser.isComplexType();
  }
}

export class ODataEntityParser<Type> implements Parser<Type> {
  name: string;
  type: string;
  base: string;
  parent: ODataEntityParser<any>;
  children: ODataEntityParser<any>[];
  fields: ODataFieldParser<any>[];

  constructor(config: EntityConfig<Type>, namespace: string) {
    this.name = config.name;
    this.type = `${namespace}.${config.name}`;
    this.base = config.base;
    this.children = [];
    this.fields = Object.entries(config.fields)
      .map(([name, f]) => new ODataFieldParser(name, f as Field));
  }

  // Deserialize
  deserialize(value: any, options: ParseOptions): Type {
    if (this.parent)
      value = this.parent.deserialize(value, options);
    return Object.assign(value, this.fields
      .filter(f => f.name in value && !Types.isNullOrUndefined(value[f.name]))
      .reduce((acc, f) => Object.assign(acc, { [f.name]: f.deserialize(value[f.name], options) }), {})
    );
  }

  // Serialize
  serialize(entity: Type, options: ParseOptions): any {
    if (this.parent)
      entity = this.parent.serialize(entity, options);
    return Object.assign(entity, this.fields
      .filter(f => f.name in entity && !Types.isNullOrUndefined(entity[f.name]))
      .reduce((acc, f) => Object.assign(acc, { [f.name]: f.serialize(entity[f.name], options) }), {})
    );
  }

  configure(settings: { parserForType: (type: string) => Parser<any> }) {
    if (this.base) {
      const parent = settings.parserForType(this.base) as ODataEntityParser<any>;
      parent.children.push(this);
      this.parent = parent;
    }
    this.fields.forEach(f => f.configure(settings));
  }

  // Json Schema
  toJsonSchema(config: JsonSchemaConfig<Type> = {}) {
    let properties = this.fields
      .filter(f => (!f.navigation || (config.expand && f.name in config.expand)) && (!config.select || (<string[]>config.select).indexOf(f.name) !== -1))
      .map(f => ({ [f.name]: f.toJsonSchema(config[f.name]) }))
      .reduce((acc, v) => Object.assign(acc, v), {});
    return {
      title: `The ${this.name} schema`,
      type: "object",
      description: `The ${this.name} configuration`,
      properties: properties,
      required: this.fields.filter(f => !f.nullable).map(f => f.name)
    };
  }

  typeFor(name: string): string {
    let field = this.fields.find(f => f.name === name);
    if (field)
      return field.type;
    else if (this.parent)
      return this.parent.typeFor(name);
  }

  keys() {
    let keys = (this.parent) ? this.parent.keys() : [];
    return [...keys, ...this.fields.filter(f => f.key)];
  }

  resolveKey(attrs: any) {
    let key = this.keys()
      .reduce((acc, f) => Object.assign(acc, { [f.name]: f.resolve(attrs) }), {});
    if (Object.keys(key).length === 1)
      key = Object.values(key)[0];
    if (!Types.isEmpty(key))
      return key;
  }

  isComplexType() {
    return this.keys().length === 0;
  }
  
  find(predicate: (p: ODataEntityParser<any>) => boolean): ODataEntityParser<any> {
    if (predicate(this))
      return this;
    return this.children.find(c => c.find(predicate));
  }

  findParser(predicate: (p: ODataEntityParser<any>) => boolean): Parser<any> {
    return this.find(predicate) || NONE_PARSER;
  }
}