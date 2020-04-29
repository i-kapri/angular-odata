import { Types, Enums } from './utils';
import { Parser, Field, JsonSchemaExpandOptions, JsonSchemaConfig, MetaEntity, MetaEnum } from './types';

export const PARSERS: {[name: string]: Parser<any>} = {
  'Date': <Parser<Date>>{
    type: 'Date',
    parse(value: any) {
      return Array.isArray(value) ?
        value.map(v => new Date(v)) :
        new Date(value);
    },
    toJSON(value: Date) { 
      return Array.isArray(value) ?
        value.map(v => new Date(v)) :
        new Date(value);
    }
  },
  'number': <Parser<number>>{
    type: 'number',
    parse(value: any) {
      return Array.isArray(value) ?
        value.map(v => Number(v)) :
        Number(value);
    },
    toJSON(value: number) { 
      return Array.isArray(value) ?
        value.map(v => Number(v)) :
        Number(value);
    }
  }
};

export interface ODataParser<Type> extends Parser<Type> { 
  configure(parsers: {[type: string]: ODataParser<any> });
  toJsonSchema(options?: JsonSchemaExpandOptions<Type>);
}

export class ODataEnumParser<Type> implements ODataParser<Type> {
  type: string;
  flags?: boolean;
  enumString?: boolean;
  members: {[name: string]: number} | {[value: number]: string};

  constructor(meta: MetaEnum<Type>, enumString?: boolean) {
    this.type = meta.type;
    this.flags = meta.flags;
    this.members = meta.members;
    this.enumString = enumString;
  }

  // Deserialize
  parse(value: any) {
    if (value === null) return value;
    return this.flags ?
      Enums.toFlags(this.members, value) :
      Enums.toValue(this.members, value);
  }

  // Serialize
  toJSON(value: any) {
    if (value === null) return value;
    let enums = this.flags ?
      Enums.toEnums(this.members, value) :
      [Enums.toEnum(this.members, value)];
    if (!this.enumString)
      enums = enums.map(e => `${this.type}'${e}'`);
    return enums.join(", ");
  }

  // Json Schema
  toJsonSchema(options: JsonSchemaExpandOptions<Type> = {}) {
    let property = <any>{
      title: `The ${this.type} field`,
      type: "string"
    };
    property.enum = Enums.keys(this.members);
    return property;
  }

  configure(parsers: { [type: string]: ODataParser<any>; }) {}
}

export class ODataFieldParser<T> implements ODataParser<T> {
  name: string;
  type: string;
  parser?: ODataParser<any>;
  default?: any;
  maxLength?: number;
  key?: boolean;
  collection?: boolean;
  nullable?: boolean;
  navigation?: boolean;
  field?: string;
  ref?: string;

  constructor(name: string, field: Field) {
    this.name = name;
    Object.assign(this, field);
  }

  resolve(value: any) {
    return this.ref.split('/').reduce((acc, name) => acc[name], value);
  }

  // Deserialize
  parse(value: any) {
    if (value === null) return value;
    if (this.parser) {
      return this.parser.parse(value);
    } else if (this.type in PARSERS) {
      return PARSERS[this.type].parse(value);
    }
    return value;
  }

  // Serialize
  toJSON(value: any) {
    if (value === null) return value;
    if (this.parser) {
      return this.parser.toJSON(value);
    } else if (this.type in PARSERS) {
      return PARSERS[this.type].toJSON(value);
    }
    return value;
  }

  configure(parsers: { [type: string]: ODataParser<any>; }) {
    if (this.type in parsers) {
      this.parser = parsers[this.type];
    }
  }

  // Json Schema
  toJsonSchema(options: JsonSchemaExpandOptions<T> = {}) {
    let property = this.parser ? this.parser.toJsonSchema(options) : <any>{
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

  isEnumType() {
    return this.parser instanceof ODataEnumParser;
  }

  isEntityType() {
    return this.parser instanceof ODataEntityParser;
  }

  isComplexType() {
    return this.parser instanceof ODataEntityParser && this.parser.isComplex();
  }

  parserFor<E>(name: string): Parser<E> {
    if (this.parser instanceof ODataEntityParser)
      return this.parser.parserFor(name);
  }

  resolveKey(attrs: any) {
    if (this.parser instanceof ODataEntityParser)
      return this.parser.resolveKey(attrs);
  }
}

export class ODataEntityParser<Type> implements ODataParser<Type> {
  type: string;
  base: string;
  parent: ODataEntityParser<any>;
  fields: ODataFieldParser<any>[];

  constructor(meta: MetaEntity<Type>) {
    this.type = meta.type;
    this.base = meta.base;
    this.fields = Object.entries(meta.fields)
      .map(([name, f]) => new ODataFieldParser(name, f as Field));
  }

  // Deserialize
  parse(objs: any): Type | Type[] {
    if (this.parent)
      objs = this.parent.parse(objs);
    let _parse = (obj) =>
      Object.assign(obj, this.fields
        .filter(f => f.name in obj)
        .reduce((acc, f) => Object.assign(acc, { [f.name]: f.parse(obj[f.name]) }), {})
      );
    return Array.isArray(objs) ?
      objs.map(obj => _parse(obj)) :
      _parse(objs);
  }

  // Serialize
  toJSON(objs: any): any {
    if (this.parent)
      objs = this.parent.toJSON(objs);
    let _toJSON = (obj) => Object.assign(obj, this.fields
      .filter(f => f.name in obj)
      .reduce((acc, f) => Object.assign(acc, { [f.name]: f.toJSON(obj[f.name]) }), {})
    );
    return Array.isArray(objs) ? 
      objs.map(obj => _toJSON(obj)) :
      _toJSON(objs);
  }

  configure(parsers: {[type: string]: ODataEntityParser<any> }) {
    if (this.base in parsers) {
      this.parent = parsers[this.base];
    }
    this.fields.forEach(f => f.configure(parsers));
  }

  // Json Schema
  toJsonSchema(config: JsonSchemaConfig<Type> = {}) {
    let properties = this.fields
      .filter(f => (!f.navigation || (config.expand && f.name in config.expand)) && (!config.select || (<string[]>config.select).indexOf(f.name) !== -1))
      .map(f => ({[f.name]: f.toJsonSchema(config[f.name])}))
      .reduce((acc, v) => Object.assign(acc, v), {});
    return {
      title: `The ${this.type} schema`,
      type: "object",
      description: `The ${this.type} configuration`,
      properties: properties,
      required: this.fields.filter(f => !f.nullable).map(f => f.name)
    };
  }

  parserFor<E>(name: string): Parser<E> {
    let parser: Parser<E>;
    if (this.parent)
      parser = this.parent.parserFor(name);
    if (!parser)
      parser = this.fields.find(f => f.name === name) as Parser<E>;
    return parser; 
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

  isComplex() {
    return this.keys().length === 0;
  }
}