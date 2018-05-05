/**
 * 枚举类型
 */
import {isObject, isArray, clone} from 'sav-util'
import {SCHEMA_ENUM} from './consts.js'

export class SchemaEnum {
  constructor (schema, opts) {
    this.schemaType = SCHEMA_ENUM
    this.enums = []
    this.keyMaps = {}
    this.keys = []
    this.values = []
    this.valueMaps = {}
    this.opts = opts
    let enums = isObject(opts.enums) ? toArray(opts.enums)
      : (isArray(opts.enums) ? opts.enums : [])
    enums.forEach((item) => this.addEnum(item))
    if (this.name) {
      schema.export(this)
    }
  }
  getEnums () {
    return clone(this.enums)
  }
  addEnum (item) {
    this.keyMaps[item.key] = item
    this.valueMaps[item.value] = item
    this.keys.push(item.key)
    this.values.push(item.value)
    this.enums.push(item)
  }
  hasKey (key) {
    return this.isStrict ? this.keys.indexOf(key) !== -1 : !!this.keyMaps[key]
  }
  hasValue (value) {
    return this.isStrict ? this.values.indexOf(value) !== -1 : !!this.valueMaps[value]
  }
  value (key) {
    if (this.isStrict) {
      let idx = this.keys.indexOf(key)
      if (idx !== -1) {
        return this.keyMaps[key].value
      }
    } else {
      return this.keyMaps[key].value
    }
  }
  key (value) {
    if (this.isStrict) {
      let idx = this.values.indexOf(value)
      if (idx !== -1) {
        return this.keyMaps[this.keys[idx]].key
      }
    } else {
      return this.valueMaps[value].key
    }
  }
  create (val) {
    if (arguments.length) {
      return val
    }
    if ('default' in this.opts) {
      return this.default
    }
    return this.values[0]
  }
  check (val) {
    return this.hasValue(val)
  }
  parse (val) {
    if (this.values.indexOf(val) !== -1) {
      return val
    } else if (this.valueMaps[val]) {
      return this.valueMaps[val].value
    }
  }
  get isStrict () {
    return this.opts.strict
  }
  get name () {
    return this.opts.name
  }
  get default () {
    return this.opts.default
  }
}

function toArray (enums) {
  return Object.keys(enums).map((it) => {
    return isObject(enums[it]) ? enums[it] : {key: it, value: enums[it]}
  })
}
