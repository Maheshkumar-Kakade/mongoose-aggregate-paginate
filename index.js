var aggregatePaginate = require('./lib/mongoose-aggregate-paginate')

module.exports = function (schema) {
  schema.statics.aggregatePaginate = aggregatePaginate
}
