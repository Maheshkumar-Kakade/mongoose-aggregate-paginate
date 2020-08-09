# mongoose-aggregate-paginate

> `mongoose-aggregate-paginate` is a [Mongoose][mongoose] plugin easy to add pagination for aggregates.  This plugin can be used in combination with view pagination middleware such as [express-paginate](https://github.com/niftylettuce/express-paginate).   

[![Build Status][travis-ci-img]][travis-ci-url] 
[![npm version][npm-version-img]][npm-version-url] 
[![Dependency Status][dependency-status-img]][dependency-status-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![js-standard-style][js-standard-style-img]][js-standard-style-url] 


[![NPM](https://nodei.co/npm/mongoose-aggregate-paginate.png?downloadRank=true&downloads=true)](https://nodei.co/npm/mongoose-aggregate-paginate/)

## Index
* [Install](#install)
* [Usage](#usage)
* [License](#license)

## Install

```bash
npm install mongoose-aggregate-paginate --save
```
## Usage

This plugin must first be added to a schema:

```js

let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

mySchema.plugin(mongooseAggregatePaginate);

```

`MyModel` will have a new function called `paginate` (e.g. `MyModel.aggregatePaginate()`).

### MyModel.aggregatePaginate(aggregate, options, callback)

**Arguments**

* `aggregate` - An object of the [Mongoose][mongoose] aggregate.
* `options` - An object with options for the [Mongoose][mongoose] query, such as sorting
  - `page` - Default: `1`
  - `limit` - Default: `10`
  - `sort` - Default: `undefined`
* `callback(err, results, pages, total)` - A callback is called once pagination results are retrieved, or an error has occurred. If not specified promise will be returned

**Returns**
* `Promise` - Promise object

**Examples**

```js

let MyModel = mongoose.model('MyModel',{
  name : String,
  age: Number,
  city, String
})

// find users above 18 by city
let aggregate = MyModel.aggregate();
aggregate.match({age : {'lt' : 18 } })
.group({ _id: '$city' , count : { '$sum' : 1 } })
let options = { page : 1, limit : 15}

// callback
MyModel.aggregatePaginate(aggregate, options, function(err, results, pages, count) {
  if(err) 
  {
    console.err(err)
  }
  else
  { 
    console.log(results)
  }
})

// Promise
 MyModel.aggregatePaginate(aggregate, options)
  .then(function(value) {
    console.log(value.docs, value.pages, value.total)
  })
  .catch(function(err){ 
    console.err(err)
  })
```
## Tests

```js
npm test
```
## Acknowledgements
mongoose-aggregate-paginate was inspired by [mongoose-paginate][mongoose-paginate].

## License
[MIT][license-url]

[mongoose]: http://mongoosejs.com
[mongoose-paginate]: https://www.npmjs.com/package/mongoose-paginate
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE
[travis-ci-img]: https://travis-ci.org/Maheshkumar-Kakade/mongoose-aggregate-paginate.svg?branch=master
[travis-ci-url]: https://travis-ci.org/Maheshkumar-Kakade/mongoose-aggregate-paginate 
[npm-version-img]: https://badge.fury.io/js/mongoose-aggregate-paginate.svg
[npm-version-url]: http://badge.fury.io/js/mongoose-aggregate-paginate
[dependency-status-img]: https://gemnasium.com/Maheshkumar-Kakade/mongoose-aggregate-paginate.svg
[dependency-status-url]: https://gemnasium.com/Maheshkumar-Kakade/mongoose-aggregate-paginate
[coveralls-image]: https://coveralls.io/repos/github/Maheshkumar-Kakade/mongoose-aggregate-paginate/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/Maheshkumar-Kakade/mongoose-aggregate-paginate?branch=master
[js-standard-style-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[js-standard-style-url]: http://standardjs.com/