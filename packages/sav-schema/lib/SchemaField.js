import {isString, isNull, isUndefined, prop} from 'sav-util'
import {SchemaRequiredError, SchemaTypeError, SchemaCheckedError, SchemaEqlError, SchemaEmptyError} from './SchemaError.js'
import {applyCheckValue} from './register.js'
import {stringVal} from './types.js'

export class SchemaField {
  constructor (schema, opts, root) {
    this.opts = opts
    let ref
    let {type, array, props} = opts
    if (isString(type)) {
      ref = root.refs[type] || schema[type]
    } else if (array) {
      ref = schema.declare({array}, root)
    } else if (props) {
      ref = schema.declare({props}, root)
    }
    prop(this, {
      root,
      ref
    })
    // 延时加载
    if (!this.ref) {
      if (type) {
        schema.delay(() => {
          prop(this, 'ref', schema[type])
        })
      }
    }
  }
  create (value) {
    let ret = arguments.length ? this.ref.create(value) : this.ref.create()
    return ret
  }
  validate (obj, opts) {
    let {required, ref} = this
    let {name, nullable, empty, space, eql} = this.opts
    if (!required && !(name in obj)) {
      return
    }
    if (nullable && isNull(obj[name])) {
      return
    }
    try {
      if (!(name in obj)) {
        throw new SchemaRequiredError(name)
      }
      let val = obj[name]
      if (!space) { // trim
        val = stringVal(val)
        if (isString(val)) {
          val = val.trim()
        }
      }
      if (!empty && !isNull(val)) {
        if (val === '') {
          throw new SchemaEmptyError(name)
        }
      }
      if (eql) {
        let eqlVal = obj[eql]
        if (eqlVal !== val) {
          throw new SchemaEqlError(name, eql)
        }
      }
      let rule = applyCheckValue(val, this.checks)
      if (rule) {
        throw new SchemaCheckedError(name, rule[0])
      }
      if (ref.validate) {
        val = ref.validate(val, opts)
      } else {
        val = checkValue(val, ref)
      }
      return val
    } catch (err) {
      if (this.opts.message) {
        err.message = this.opts.message
      }
      throw err
    }
  }
  get required () {
    let {required, optional} = this.opts
    return isUndefined(required) ? !optional : required
  }
  get name () {
    return this.opts.name
  }
  get checks () {
    return this.opts.checks
  }
  getOpt (name) {
    return this.opts[name]
  }
}

function checkValue (val, ref) {
  if (ref.parse) {
    val = ref.parse(val)
  }
  if (!ref.check(val)) {
    throw new SchemaTypeError(ref.name, val)
  }
  return val
}
