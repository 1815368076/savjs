/**
 * 简单类型
 */
import {isFunction} from 'sav-util'
import {SCHEMA_TYPE} from './consts.js'

export class SchemaType {
  constructor (schema, opts) {
    this.schemaType = SCHEMA_TYPE
    this.opts = opts
    if (this.name) {
      schema.export(this)
    }
  }
  get name () {
    let {name} = this.opts
    return isFunction(name) ? name.name : name
  }
  parse (val) {
    return this.opts.parse(val)
  }
  check (val) {
    return this.opts.check(val)
  }
  create (val) {
    if (arguments.length) {
      return this.parse(val)
    }
    let fn = this.opts.default || this.opts.name
    return fn()
  }
}
