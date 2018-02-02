'use strict'

/**
 * Paginate Mongoose aggregate result
 * @param  {Aggregate} aggregate
 * @param  {any} options {page: number/string default 10, limit: number/string default 10,sortBy: any default null}
 * @param  {function} [callback]
 * @returns {Promise}
 */
function aggregatePaginate (aggregate, options, callback) {
  options = options || {}
  var pageNumber = parseInt(options.page || 1, 10)
  var resultsPerPage = parseInt(options.limit || 10, 10)
  var skipDocuments = (pageNumber - 1) * resultsPerPage
  var sortBy = options.sortBy

  var q = this.aggregate(aggregate._pipeline)
  var countQuery = this.aggregate(q._pipeline)
  if (q.hasOwnProperty('options')) {
    q.options = aggregate.options
    countQuery.options = aggregate.options
  }

  if (sortBy) {
    q.sort(sortBy)
  }

  return Promise.all([q.skip(skipDocuments).limit(resultsPerPage).exec(), countQuery.group({ _id: null, count: { $sum: 1 } }).exec()])
    .then(function (values) {
      var count = values[1][0] ? values[1][0].count : 0
      if (typeof callback === 'function') {
        return callback(null, values[0], Math.ceil(count / resultsPerPage) || 1, values[1][0] ? count : 0)
      }
      return Promise.resolve({
        data: values[0],
        pageCount: (Math.ceil(count / resultsPerPage) || 1),
        totalCount: count
      })
    })
    .catch(function (reject) {
      if (typeof callback === 'function') {
        return callback(reject)
      }
      return Promise.reject(reject)
    })
}

module.exports = aggregatePaginate
