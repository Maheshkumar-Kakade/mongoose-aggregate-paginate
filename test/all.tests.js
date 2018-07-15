/* eslint-env mocha */
var mongoose = require('mongoose')
require('should')
var mongooseAggregatePaginate = require('../')
mongoose.connect('mongodb://localhost/MongooseAggregatePaginate-test', {useMongoClient: true})
// mongoose.set('debug', true)
var Schema = mongoose.Schema
mongoose.Promise = Promise

/**
* test Schema
*/
var testSchema = new Schema({
  studentId: Number,
  marksheet: [{
    subject: String,
    marks: Number
  }]
},
  {
    timestamps: { createdAt: 'created', updatedAt: 'modified' }
  }
)
testSchema.plugin(mongooseAggregatePaginate)

var TestModel = mongoose.model('TestModel', testSchema, 'studentMarksheet')

module.exports = testSchema

describe('Mongoose Aggregate Paginate tests', function () {
  before(function (done) {
    var testData = []
    for (var index = 0; index < 100; ++index) {
      testData.push(new TestModel({ studentId: index, marksheet: [{ subject: 'physics', marks: 100 - (index % 9) }, { subject: 'math', marks: 100 - (index % 8) }, { subject: 'chem', marks: 100 - (index % 7) }] }))
    }
    Promise.all([TestModel.remove({}), TestModel.create(testData)])
      .then(function () { done() })
      .catch(done)
  })

  after(function (done) {
    mongoose.connection.close()
    done()
  })

  describe('Basic Tests on 100 documents', function () {
    var query = TestModel.aggregate().allowDiskUse(true)
      .project({ 'marksheet': 1, 'studentId': 1 })
      .unwind('$marksheet')
      .group({ _id: '$studentId', total: { $sum: '$marksheet.marks' } })
    describe('without page and limit (callback)', function () {
      it('should return 10 results, page count = 10 and total count = 100', function (done) {
        TestModel.aggregatePaginate(query, {}, function (err, result, pageCount, totalCount) {
          if (err) return done(err)
          result.length.should.equal(10)
          pageCount.should.equal(10)
          totalCount.should.equal(100)
          done()
        })
      })
    })

    describe('without page and limit (Promise)', function () {
      it('should return 10 results, page count = 10 and total count = 100', function (done) {
        TestModel.aggregatePaginate(query, {})
          .then(function (value) {
            value.data.length.should.equal(10)
            value.pageCount.should.equal(10)
            value.totalCount.should.equal(100)
            done()
          })
          .catch(done)
      })
    })

    describe('without page and limit using undefined as options param (callback)', function () {
      it('should return 10 results, page count = 10 and total count = 100', function (done) {
        TestModel.aggregatePaginate(query, undefined, function (err, result, pageCount, totalCount) {
          if (err) return done(err)
          result.length.should.equal(10)
          pageCount.should.equal(10)
          totalCount.should.equal(100)
          done()
        })
      })
    })

    describe('without page and limit using undefined as options param (Promise)', function () {
      it('should return 10 results, page count = 10 and total count = 100', function (done) {
        TestModel.aggregatePaginate(query, undefined)
          .then(function (value) {
            value.data.length.should.equal(10)
            value.pageCount.should.equal(10)
            value.totalCount.should.equal(100)
            done()
          })
          .catch(done)
      })
    })

    describe('with limit (callback)', function () {
      it('should return 20 results, page count = 5 and total count = 100 when limit is 20', function (done) {
        TestModel.aggregatePaginate(query, { limit: 20 }, function (err, result, pageCount, totalCount) {
          if (err) return done(err)
          result.length.should.equal(20)
          pageCount.should.equal(5)
          totalCount.should.equal(100)
          done()
        })
      })

      it('should return 5 results, page count = 20 and total count = 100 when limit is 5', function (done) {
        TestModel.aggregatePaginate(query, { limit: 5 }, function (err, result, pageCount, totalCount) {
          if (err) return done(err)
          result.length.should.equal(5)
          pageCount.should.equal(20)
          totalCount.should.equal(100)
          done()
        })
      })

      it('should return 100 results, page count = 1 and total count = 100 when limit is 200', function (done) {
        TestModel.aggregatePaginate(query, { limit: 200 }, function (err, result, pageCount, totalCount) {
          if (err) return done(err)
          result.length.should.equal(100)
          pageCount.should.equal(1)
          totalCount.should.equal(100)
          done()
        })
      })

      it('should return 0 results, page count = 1 and total count = 100 when limit = 200 and page = 2', function (done) {
        TestModel.aggregatePaginate(query, { limit: 200, page: 2 }, function (err, result, pageCount, totalCount) {
          if (err) return done(err)
          result.length.should.equal(0)
          pageCount.should.equal(1)
          totalCount.should.equal(100)
          done()
        })
      })

      it('should return 10 results, page count = 10 and total count = 100 when limit = 10 and page = 1 sort order = total desc', function (done) {
        // var sortQuery = TestModel.aggregate(query._pipeline)
        TestModel.aggregatePaginate(query, { limit: 10, page: 1, sortBy: { 'total': -1, '_id': -1 } }, function (err, result, pageCount, totalCount) {
          if (err) return done(err)
          result.length.should.equal(10)
          pageCount.should.equal(10)
          totalCount.should.equal(100)
          result[0]['total'].should.equal(300)
          done()
        })
      })
    })

    describe('with limit (Promise)', function () {
      it('should return 20 results, page count = 5 and total count = 100 when limit is 20', function (done) {
        TestModel.aggregatePaginate(query, { limit: 20 })
          .then(function (value) {
            value.data.length.should.equal(20)
            value.pageCount.should.equal(5)
            value.totalCount.should.equal(100)
            done()
          })
          .catch(done)
      })

      it('should return 5 results, page count = 20 and total count = 100 when limit is 5', function (done) {
        TestModel.aggregatePaginate(query, { limit: 5 })
          .then(function (value) {
            value.data.length.should.equal(5)
            value.pageCount.should.equal(20)
            value.totalCount.should.equal(100)
            done()
          })
          .catch(done)
      })

      it('should return 100 results, page count = 1 and total count = 100 when limit is 200', function (done) {
        TestModel.aggregatePaginate(query, { limit: 200 })
          .then(function (value) {
            value.data.length.should.equal(100)
            value.pageCount.should.equal(1)
            value.totalCount.should.equal(100)
            done()
          })
          .catch(done)
      })

      it('should return 0 results, page count = 1 and total count = 100 when limit = 200 and page = 2', function (done) {
        TestModel.aggregatePaginate(query, { limit: 200, page: 2 })
          .then(function (value) {
            value.data.length.should.equal(0)
            value.pageCount.should.equal(1)
            value.totalCount.should.equal(100)
            done()
          })
          .catch(done)
      })

      it('should return 10 results, page count = 10 and total count = 100 when limit = 10 and page = 1 sort order = total desc', function (done) {
        // var sortQuery = TestModel.aggregate(query._pipeline)
        TestModel.aggregatePaginate(query, { limit: 10, page: 1, sortBy: { 'total': -1, '_id': -1 } })
          .then(function (value) {
            value.data.length.should.equal(10)
            value.pageCount.should.equal(10)
            value.totalCount.should.equal(100)
            value.data[0]['total'].should.equal(300)
            done()
          })
          .catch(done)
      })
    })

    describe('with page (callback)', function () {
      it('should return 10 results, page count = 10 and total count = 100 when page = 1', function (done) {
        TestModel.aggregatePaginate(query, { page: 1 }, function (err, result, pageCount, totalCount) {
          if (err) return done(err)
          result.length.should.equal(10)
          pageCount.should.equal(10)
          totalCount.should.equal(100)
          done()
        })
      })

      it('should return 10 results, page count = 10 and total count = 100 when page = 2', function (done) {
        TestModel.aggregatePaginate(query, { page: 2 }, function (err, result, pageCount, totalCount) {
          if (err) return done(err)
          result.length.should.equal(10)
          pageCount.should.equal(10)
          totalCount.should.equal(100)
          done()
        })
      })

      it('should return 10 results, page count = 10 and total count = 100 when page = 10', function (done) {
        TestModel.aggregatePaginate(query, { page: 10 }, function (err, result, pageCount, totalCount) {
          if (err) return done(err)
          result.length.should.equal(10)
          pageCount.should.equal(10)
          totalCount.should.equal(100)
          done()
        })
      })

      it('should return 20 results, page count = 5 and total count = 100 when page = 5 , limit = 20 sort total desc', function (done) {
        TestModel.aggregatePaginate(query, { page: 5, limit: 20, sortBy: { 'total': -1 } }, function (err, result, pageCount, totalCount) {
          if (err) return done(err)
          result.length.should.equal(20)
          pageCount.should.equal(5)
          totalCount.should.equal(100)
          result[0]['total'].should.not.equal(300)
          done()
        })
      })

      it('should return error', function (done) {
        TestModel.aggregatePaginate(query, { page: -5, limit: 20, sortBy: { 'total': -1 } }, function (err, result, pageCount, totalCount) {
          if (err) {
            err.should.should.not.equal(null)
            done()
            return
          }
          done('no error return')
        })
        it('should return error', function (done) {
          var q = TestModel.aggregate()
            .project({ 'marksheet': 1, 'studentId': 1 })
            .unwind('marksheet')
            .group({ _id: '$studentId', total: { $sum: '$marksheet.marks' } })
          TestModel.aggregatePaginate(q, { page: -5, limit: 20, sortBy: { 'total': -1 } }, function (err, result, pageCount, totalCount) {
            if (err) {
              err.should.should.not.equal(null)
              done()
              return
            }
            done('no error return')
          })
        })
      })
    })

    describe('with page (Promise)', function () {
      it('should return 10 results, page count = 10 and total count = 100 when page = 1', function (done) {
        TestModel.aggregatePaginate(query, { page: 1 })
          .then(function (value) {
            value.data.length.should.equal(10)
            value.pageCount.should.equal(10)
            value.totalCount.should.equal(100)
            done()
          })
          .catch(done)
      })

      it('should return 10 results, page count = 10 and total count = 100 when page = 2', function (done) {
        TestModel.aggregatePaginate(query, { page: 2 })
          .then(function (value) {
            value.data.length.should.equal(10)
            value.pageCount.should.equal(10)
            value.totalCount.should.equal(100)
            done()
          })
          .catch(done)
      })

      it('should return 10 results, page count = 10 and total count = 100 when page = 10', function (done) {
        TestModel.aggregatePaginate(query, { page: 10 })
          .then(function (value) {
            value.data.length.should.equal(10)
            value.pageCount.should.equal(10)
            value.totalCount.should.equal(100)
            done()
          })
          .catch(done)
      })

      it('should return 20 results, page count = 5 and total count = 100 when page = 5 , limit = 20 sort total desc', function (done) {
        TestModel.aggregatePaginate(query, { page: 5, limit: 20, sortBy: { 'total': -1 } })
          .then(function (value) {
            value.data.length.should.equal(20)
            value.pageCount.should.equal(5)
            value.totalCount.should.equal(100)
            value.data[0]['total'].should.not.equal(300)
            done()
          })
          .catch(done)
      })

      it('should return error', function (done) {
        TestModel.aggregatePaginate(query, { page: -5, limit: 20, sortBy: { 'total': -1 } })
          .then(function (value) {
            done('no error return')
          })
          .catch(function (err) {
            err.should.should.not.equal(null)
            done()
          })
        it('should return error', function (done) {
          var q = TestModel.aggregate()
            .project({ 'marksheet': 1, 'studentId': 1 })
            .unwind('marksheet')
            .group({ _id: '$studentId', total: { $sum: '$marksheet.marks' } })
          TestModel.aggregatePaginate(q, { page: -5, limit: 20, sortBy: { 'total': -1 } })
            .then(function (value) {
              done('no error return')
            })
            .catch(function (err) {
              err.should.should.not.equal(null)
              done()
            })
        })
      })
    })
  })
})
