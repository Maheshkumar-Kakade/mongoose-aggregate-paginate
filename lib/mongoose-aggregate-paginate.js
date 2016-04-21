'use scrict'

var async = require('async')
/**
 * Peginate Mongoose aggregate result
 * @param  {Aggregate} aggregate
 * @param  {any} options {page: number/string default 10,limt: number/string default 10,sortBy: any default null}
 * @param  {function} callback
 */
function aggregatePaginate (aggregate, options, callback) {
  options = options || {}
  var pageNumber = parseInt(options.page || 1, 10)
  var resultsPerPage = parseInt(options.limit || 10, 10)
  var skipDocuments = (pageNumber - 1) * resultsPerPage
  var sortBy = options.sortBy

  var q = this.aggregate(aggregate._pipeline)
  var countQuery = this.aggregate(q._pipeline)

  if (sortBy) {
    q.sort(sortBy)
  }

  async.parallel({
    results: function (callback) {
      q.skip(skipDocuments)
        .limit(resultsPerPage)
        .exec(callback)
    },
    count: function (callback) {
      countQuery.group({ _id: null, count: { $sum: 1 } })
        .exec(function (err, result) {
          if (err) { callback(err) } else {
            callback(null, result.length === 0 ? 0 : result[0].count)
          }
        })
    }
  }, function (error, data) {
    if (error) {
      return callback(error)
    }
    callback(null, data.results, Math.ceil(data.count / resultsPerPage) || 1, data.count)
  })
}

module.exports = aggregatePaginate
