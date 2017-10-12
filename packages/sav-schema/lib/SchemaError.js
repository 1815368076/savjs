
let errors = {
  type: 'Value [{value}] is not of [{type}] type',
  require: 'Field [{field}] not found',
  check: 'Field [{field}] can not matched [{rule}] rule',
  rule: 'Rule [{rule}] not found',
  regexp: 'Can not parse RegExp [{regexp}]'
}

export class SchemaTypeError extends Error {
  constructor (type, value, message = errors.type) {
    let val = String(value)
    super(message.replace('{type}', type).replace('{value}', val))
    this.type = type
    this.value = value
  }
}

export class SchemaRequiredError extends Error {
  constructor (field, message = errors.require) {
    super(message.replace('{field}', field))
    this.field = field
  }
}

export class SchemaCheckedError extends Error {
  constructor (field, rule, message = errors.check) {
    super(message.replace('{field}', field).replace('{rule}', rule))
    this.field = field
    this.rule = rule
  }
}

export class SchemaNoRuleError extends Error {
  constructor (rule, message = errors.rule) {
    super(message.replace('{rule}', rule))
    this.rule = rule
  }
}

export class SchemaInvalidRegexpError extends Error {
  constructor (regexp, message = errors.regexp) {
    super(message.replace('{regexp}', regexp))
    this.regexp = regexp
  }
}

export function setErrors (errs) {
  Object.assign(errors, errs)
}

export function getErrors () {
  return errors
}
