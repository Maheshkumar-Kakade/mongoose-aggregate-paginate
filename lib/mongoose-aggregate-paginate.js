'use strict'

/**
 * Paginate Mongoose aggregate result
 * @param  {Aggregate} aggregate
 * @param  {any} options {page: number/string default 10, limit: number/string default 10,sort: any default null}
 * @param  {function} [callback]
 * @returns {Promise}
 */
function aggregatePaginate (aggregate, options, callback) {
  options = options || {}
  let pageNumber = parseInt(options.page || 1, 10)
  let resultsPerPage = parseInt(options.limit || 10, 10)
  let skipDocuments = (pageNumber - 1) * resultsPerPage
  let sort = options.sort

  let q = this.aggregate(aggregate._pipeline)
  let countQuery = this.aggregate(q._pipeline)
  if (q.hasOwnProperty('options')) {
    q.options = aggregate.options
    countQuery.options = aggregate.options
  }

  if (sort) {
    q.sort(sort)
  }

  return Promise.all([
    q.skip(skipDocuments).limit(resultsPerPage).exec(),
    countQuery.group({
      _id: null,
      count: {$sum: 1}
    }).exec()
  ])
    .then(function (values) {
      let count = values[1][0] ? values[1][0].count : 0
      if (typeof callback === 'function') {
        return callback(null, values[0], Math.ceil(count / resultsPerPage) || 1, values[1][0] ? count : 0)
      }
      return Promise.resolve({
        docs: values[0],
        total: count,
        limit: resultsPerPage,
        page: pageNumber,
        pages: (Math.ceil(count / resultsPerPage) || 1)
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
